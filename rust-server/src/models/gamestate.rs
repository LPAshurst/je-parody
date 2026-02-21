use std::{collections::HashMap, sync::Arc};
use serde::Deserialize;
use tokio::sync::RwLock;
use crate::socket::misc::{generate_code, forfeit_clue};

#[derive(Debug)]
pub enum GameError {
    GameNotFound,
    MalformedClue,
    PlayerNotFound,
    PlayerExists
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Player {
    pub score: i32,
    pub has_answered: bool,
    pub wager: i32,
    pub wagered: bool,
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Game {
    pub code: String,
    pub players: HashMap<String, Player>,
    pub current_clue_position: Option<usize>,
    pub active_player: Option<String>,
    pub buzzer_locked: bool,
    pub clues: Vec<GameClue>,
    pub player_picking_category: Option<String>,
    pub clues_answered: usize,
    pub game_started: bool
}

#[derive(Clone, Debug, Deserialize, serde::Serialize)]
pub struct GameClue {
    pub position: usize,
    pub clue: String,
    pub response: String,
    pub category: String,
    pub answered: bool,
    pub clue_val: i32,
    pub daily_double: bool
}

pub type GameRooms = HashMap<String, Game>;

#[derive(Clone, Default, Debug)]
pub struct GameStore {
    pub games: Arc<RwLock<GameRooms>>,
}

impl GameStore {
    pub async fn create_game(&self) -> Game {
        let code = generate_code();
        let game = Game {
            code: code.clone(),
            players: HashMap::new(),
            current_clue_position: None,
            active_player: None,
            buzzer_locked: true,
            clues: Vec::new(),
            player_picking_category: None,
            clues_answered: 0,
            game_started: false
        };
        
        self.games.write().await.insert(code, game.clone());
        game
    }


    pub async fn delete_game(&self, room_id: &str) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        games.remove(room_id)
            .map(|_| ())
            .ok_or(GameError::GameNotFound)
    }
    

    pub async fn initialize_game(&self, game_id: &str, clues: Vec<GameClue>, player_picking_category: String) -> Option<Game> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {
            game.clues = clues;
            game.player_picking_category = Some(player_picking_category);
            game.game_started = true;
            Some(game.clone())
        } else {
            None
        }

    }

    pub async fn add_player(&self, game_id: &str, player: Player, user_name: &str) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {

            if game.players.contains_key(user_name) {
                return Err(GameError::PlayerExists)
            }
            game.players.insert(user_name.to_string(), player);
            return Ok(());
        }
        Err(GameError::GameNotFound)
    }
    
    pub async fn get_game(&self, game_id: &str) -> Option<Game> {
        self.games.read().await.get(game_id).cloned()
    }

    pub async fn select_clue(&self, selected_clue_data: &SelectedClueData) -> Result<(), GameError>  {

        let mut games = self.games.write().await;
        let game = games.get_mut(&selected_clue_data.room_id);

        if let Some(game) = game {
            if selected_clue_data.position >= game.clues.len() {
                return Err(GameError::MalformedClue);
            }

            if game.clues[selected_clue_data.position].answered {
                return Err(GameError::MalformedClue);
            }

            game.current_clue_position = Some(selected_clue_data.position);
            if !selected_clue_data.daily_double {
                game.buzzer_locked = false;
            } else {
                game.buzzer_locked = true;
            }
            return Ok(())
        }
        return Err(GameError::GameNotFound);

    }
    
    pub async fn buzz_in(&self, game_id: &str, user_name: &str) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {

            if game.buzzer_locked {
                return Ok(())
            }
            
            game.active_player = Some(user_name.to_string());
            game.buzzer_locked = true;
            return Ok(())
        }
        return Err(GameError::GameNotFound);
    }

    pub async fn close_clue(&self, game_id: &str) ->  Result<(), GameError>{
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);

        if let Some(game) = game {
            forfeit_clue(game);
            Ok(())
        } else {
            return Err(GameError::GameNotFound);
        }
        
    }


    pub async fn update_manual_score(&self, game_id: &str, user_name: &str, amount: i32) -> Result<(), GameError>{
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {
            if let Some(player) = game.players.get_mut(user_name) {
                player.score += amount;
            } else {
                return Err(GameError::PlayerNotFound);
            }
           Ok(())
        } else {
            Err(GameError::GameNotFound)
        }

    }

    pub async fn store_wager(&self, daily_double_wager: &DailyDoubleWager) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        let game = games.get_mut(&daily_double_wager.room_id).ok_or(GameError::GameNotFound)?;

        if let Some(player_name) = &game.player_picking_category {
            let player = game.players.get_mut(player_name).ok_or(GameError::PlayerNotFound)?;
            let max_wager = std::cmp::min(daily_double_wager.wager, 1000);
            player.wager = max_wager;
            player.wagered = true;
        }
        Ok(())
    }

    pub async fn consume_wager(&self, game_id: &str, correct_response: bool) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id).ok_or(GameError::GameNotFound)?;
        
        let clue_position = game.current_clue_position.ok_or(GameError::MalformedClue)?;
        let clue = game.clues.get_mut(clue_position).ok_or(GameError::MalformedClue)?;

        if let Some(player_name) = &game.player_picking_category {
            let player = game.players.get_mut(player_name).ok_or(GameError::PlayerNotFound)?;
            println!("{}", player.wager);
            if correct_response {
                player.score += player.wager;
                println!("{}", player.score);

            } else {
                player.score -= player.wager;
                println!("{}", player.score);

            }
            player.wager = 0;
            player.wagered = false;

                    // sanity check reset
            for player in game.players.values_mut() {
                player.has_answered = false;
            }
            game.buzzer_locked = true;
            clue.answered = true;
            game.active_player = None;
            game.clues_answered += 1;
            Ok(())
        } else {
            Err(GameError::PlayerNotFound)
        }

    }


    pub async fn update_score(&self, game_id: &str, correct_response: bool) -> Result<(), GameError> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id).ok_or(GameError::GameNotFound)?;
        
        let clue_position = game.current_clue_position.ok_or(GameError::MalformedClue)?;
        let clue = game.clues.get_mut(clue_position).ok_or(GameError::MalformedClue)?;
        let clue_value = clue.clue_val;

        if let Some(player_name) = &game.active_player {
            let player = game.players.get_mut(player_name).ok_or(GameError::PlayerNotFound)?;

            if correct_response {
                player.score += clue_value;
                clue.answered = true;
                game.current_clue_position = None;
                game.buzzer_locked = true;

                for player in game.players.values_mut() {
                    player.has_answered = false;
                }
                game.player_picking_category = Some(player_name.to_string());
                game.clues_answered += 1;
            } else {
                player.score -= clue_value;
                game.buzzer_locked = false;
                player.has_answered = true;
            }
        } else {
            // forfeit the points
            clue.answered = true;
            forfeit_clue(game);
            game.clues_answered += 1;
        }
        
        game.active_player = None;
        Ok(())
    }
}


#[derive(Deserialize, Debug)]
pub struct JoinGameData {
    pub room_id: String,
    pub user_name: String,
}

#[derive(Deserialize, Debug)]
pub struct ManualIncrementData {
    pub room_id: String,
    pub user_name: String,
    pub amount: i32
}

#[derive(Deserialize, Debug, serde::Serialize)]
pub struct StartGameData {
    pub room_id: String,
    pub clues: Vec<GameClue>,
    pub player_picking_category: String,
}

#[derive(Deserialize, Debug)]
pub struct ResponseData {
    pub room_id: String,
    pub correct_response: bool,
}

#[derive(Deserialize, Debug)]
pub struct SelectedClueData {
    pub room_id: String,
    pub position: usize,
    pub daily_double: bool
}

#[derive(Deserialize, Debug)]
pub struct DailyDoubleWager {
    pub room_id: String,
    pub wager: i32
}
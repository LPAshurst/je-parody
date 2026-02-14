use std::{collections::HashMap, sync::Arc};
use serde::Deserialize;
use tokio::sync::RwLock;
use crate::socket::misc::{generate_code, forfeit_clue};

#[derive(Debug)]
pub enum GameError {
    GameNotFound,
    MalformedClue,
    PlayerNotFound
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Player {
    pub score: i32,
    pub has_answered: bool
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Game {
    pub code: String,
    pub players: HashMap<String, Player>,
    pub current_clue_position: Option<usize>,
    pub active_player: Option<String>,
    pub buzzer_locked: bool,
    pub clues: Vec<GameClue>
}

#[derive(Clone, Debug, Deserialize, serde::Serialize)]
pub struct GameClue {

    pub position: usize,
    pub clue: String,
    pub response: String,
    pub category: String,
    pub answered: bool,
    pub clue_val: i32  
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
            clues: Vec::new()
        };
        
        self.games.write().await.insert(code, game.clone());
        game
    }
    

    pub async fn initialize_game(&self, game_id: &str, clues: Vec<GameClue>) -> Option<Game> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {
            game.clues = clues;
            Some(game.clone())
        } else {
            None
        }

    }

    pub async fn add_player(&self, game_id: &str, player: Player, user_name: &str) -> Result<(), GameError>  {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);
        if let Some(game) = game {
            game.players.insert(user_name.to_string(), player);
            return Ok(());
        }
        Err(GameError::GameNotFound)
    }
    
    pub async fn get_game(&self, game_id: &str) -> Option<Game> {
        self.games.read().await.get(game_id).cloned()
    }

    pub async fn select_clue(&self, game_id: &str, clue_position: usize) -> Result<(), GameError>  {

        let mut games = self.games.write().await;
        let game = games.get_mut(game_id);

        if let Some(game) = game {
            if clue_position >= game.clues.len() {
                return Err(GameError::MalformedClue);
            }

            if game.clues[clue_position].answered {
                return Err(GameError::MalformedClue);
            }

            game.current_clue_position = Some(clue_position);
            game.buzzer_locked = false;
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
            } else {
                player.score -= clue_value;
                game.buzzer_locked = false;
                player.has_answered = true;
            }
        } else {
            // forfeit the points
            clue.answered = true;
            forfeit_clue(game);
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
}
use std::{collections::HashMap, sync::Arc};
use serde::Deserialize;
use tokio::sync::RwLock;
use crate::socket::misc::{generate_code, forfeit_clue};

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
    

    pub async fn initialize_game(&self, game_id: &str, clues: Vec<GameClue>) -> Game {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id).unwrap();
        game.clues = clues;

        game.clone()

    }

    pub async fn add_player(&self, game_id: &str, player: Player, user_name: &str) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        game.players.insert(user_name.to_string(), player);
        Some(())
    }
    
    pub async fn get_game(&self, game_id: &str) -> Option<Game> {
        self.games.read().await.get(game_id).cloned()
    }

    pub async fn select_clue(&self, game_id: &str, clue_position: usize) -> Option<()>{

        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;

        if clue_position >= game.clues.len() {
            return None;
        }

        if game.clues[clue_position].answered {
            return None;
        }

        game.current_clue_position = Some(clue_position);
        game.buzzer_locked = false;

        Some(())
    }
    
    pub async fn buzz_in(&self, game_id: &str, user_name: &str) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        
        if game.buzzer_locked {
            return None;
        }
        
        game.active_player = Some(user_name.to_string());
        game.buzzer_locked = true;
        Some(())
    }

    pub async fn close_clue(&self, game_id: &str) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        forfeit_clue(game)
    }


    pub async fn update_manual_score(&self, game_id: &str, user_name: &str, amount: i32) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;

        if let Some(player) = game.players.get_mut(user_name) {
            player.score += amount;
        }
        Some(())
    }



    pub async fn update_score(&self, game_id: &str, correct_response: bool) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        
        let clue_position = game.current_clue_position?;
        let clue = game.clues.get_mut(clue_position)?;
        let clue_value = clue.clue_val;

        if let Some(player_name) = &game.active_player {
            let player = game.players.get_mut(player_name).unwrap();

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

        Some(())
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
use std::{collections::HashMap, sync::Arc};
use rand::Rng;
use serde::Deserialize;
use tokio::sync::RwLock;

// Generate random room code, implementation should be fine for sparse gamelists
fn generate_code() -> String {
    let mut rng = rand::rng();

    let code: String = (0..4)
        .map(|_| {
            let idx: u8 = rng.random_range(0..36);
            if idx < 10 {
                (b'0' + idx) as char
            } else {
                (b'a' + (idx - 10)) as char
            }
        })
        .collect();

    return code;
    
    
}

#[derive(Clone, Debug, serde::Serialize)]
pub struct Player {
    pub score: i32,
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
            buzzer_locked: false,
            clues: Vec::new()
        };
        
        self.games.write().await.insert(code, game.clone());
        game
    }
    

    pub async fn initialize_game(&self, game_id: &str, clues: Vec<GameClue>, players: Vec<String>) -> Game {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id).unwrap();
        let game_players = &mut game.players;
        for player in players {
            game_players.insert(player, Player {score: 0});
        }
        game.clues = clues;

        games.get(game_id).unwrap().clone()

    }

    pub async fn add_player(&self, game_id: &str, player: Player, user_name: String) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        game.players.insert(user_name, player);
        Some(())
    }
    
    pub async fn get_game(&self, game_id: &str) -> Option<Game> {
        self.games.read().await.get(game_id).cloned()
    }

    pub async fn select_clue(&self, game_id: &str, clue_position: usize) -> Option<()>{

        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
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
    
    pub async fn update_score(&self, game_id: &str, correct_response: bool) -> Option<()> {
        let mut games = self.games.write().await;
        let game = games.get_mut(game_id)?;
        let clue = game.clues.get_mut(game.current_clue_position.unwrap())?;
        let player = game.players.get_mut(&game.active_player.clone().unwrap())?;
        

        if correct_response {
            player.score += clue.clue_val;
            clue.answered = true;
            game.current_clue_position = None;
            game.buzzer_locked = true;
        } else {
            player.score -= clue.clue_val;
            game.buzzer_locked = false;
        }
        game.active_player = None;

        Some(())
    }
}
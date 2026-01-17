use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ExternalClue {
    pub id: i32,
    pub game_id: i32,
    pub value: i32,
    pub round: String,
    pub category: String,
    pub clue: String,
    pub response: String,

}

#[derive(Serialize, Deserialize, Clone)]
pub struct Clue {
    pub id: i32,
    pub clue_val: i32,
    pub daily_double: bool,
    pub round: String,
    pub category: String,
    pub clue: String,
    pub response: String,
    pub clue_is_picture: bool,
    pub position: i32,
}

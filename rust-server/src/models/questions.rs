use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ExternalClueResponse {
    pub status: String,
    pub data: Vec<Clue>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Clue {
    pub id: i32,
    pub game_id: i32,
    pub value: i32,
    pub daily_double: bool,
    pub round: String,
    pub category: String,
    pub clue: String,
    pub response: String,
}


use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ExternalClueResponse {
    pub status: String,
    pub data: Vec<Clue>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
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

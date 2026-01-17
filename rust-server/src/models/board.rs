use serde::{Deserialize, Serialize};

use crate::models::clues::{Clue, ExternalClue};

#[derive(Serialize, Deserialize, Clone)]
pub struct BoardFromFrontend {
    pub title: String,
    pub clues: Vec<Clue>,
}

#[derive(Serialize, Deserialize)]
pub struct BoardToFrontend {
    pub status: String,
    pub data: Vec<ExternalClue>,
}

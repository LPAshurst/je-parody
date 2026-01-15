use serde::{Deserialize, Serialize};

use crate::models::clues::Clue;

#[derive(Serialize, Deserialize, Clone)]
pub struct Board {
    pub title: String,
    pub clues: Vec<Clue>,
}

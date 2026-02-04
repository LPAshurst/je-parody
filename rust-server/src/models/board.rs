use serde::{Deserialize, Serialize};
use sqlx::FromRow;

use crate::models::clues::{Clue, ExternalClue};

#[derive(Serialize, Deserialize, Clone)]
pub struct InternalBoard {
    pub title: String,
    pub slug: String,
    pub clues: Vec<Clue>,
}

#[derive(Serialize, Deserialize)]
pub struct ExternalBoard {
    pub status: String,
    pub data: Vec<ExternalClue>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Board {
    pub id: i32,
    pub user_id: i32,
    pub board_name: String,
    pub slug: String,
    pub is_public: bool,
    pub created_at: Option<chrono::NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateCategoryRequest {
    pub category_index: i32,
    pub new_category_name: String,
}

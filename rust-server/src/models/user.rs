use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub created_at: Option<chrono::NaiveDateTime>
}

// For creating a new user (no id or created_at yet)
#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
}
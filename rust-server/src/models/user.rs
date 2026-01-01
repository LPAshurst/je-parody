use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
    pub created_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
pub struct CreateAndCheckUser {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserSession {
    pub id: i32,
    pub session_token: Uuid,
    pub user_id: i32,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub expires_at: Option<chrono::NaiveDateTime>,
    pub last_activity: Option<chrono::NaiveDateTime>,
}

// pub struct FrontEndUser {
//     pub username: String,
// }

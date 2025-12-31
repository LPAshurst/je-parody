use axum::{extract::{Json, Path, State}, http::StatusCode};
use sqlx::{Postgres, Pool};
use crate::models::user::{CreateUser, User};
use axum::{
    routing::{get, post}, Router,
};

pub fn routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/create_user", post(create_user))              
        .route("/retrieve_user/{username}", get(retrieve_user))      
}

async fn retrieve_user(State(pool): State<Pool<Postgres>>, Path(username): Path<String>) -> Result<Json<User>, StatusCode> {

    let result = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1") 
        .bind(username)
        .fetch_one(&pool)
        .await;

    match result {
        Ok(user) => Ok(Json(user)),
        Err(e) => {
            eprintln!("There was an error getting the user: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }

}

async fn create_user(State(pool): State<Pool<Postgres>>, Json(new_user): Json<CreateUser>) -> StatusCode {

    let result = sqlx::query("INSERT INTO users (username, email) VALUES ($1, $2)")
        .bind(&new_user.username)
        .bind(&new_user.email)
        .execute(&pool)
        .await;

    match result {
        Ok(_) => StatusCode::CREATED,
        Err(e) => {
            println!("Database error: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        }
        
    }

}
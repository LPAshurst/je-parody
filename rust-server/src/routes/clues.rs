use std::env;

use axum::extract::{Json, Path, State};
use axum::routing::put;
use axum::{Router, routing::get};

use reqwest::StatusCode;
use sqlx::{Pool, Postgres};

use crate::models::clues::{Clue};
use crate::models::board::{ExternalBoard};
use crate::models::user::AuthenticatedUser;

pub fn question_routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/random_question", get(get_random_question))
        .route("/update_clue/{slug}", put(update_clue))
}


async fn update_clue(
    AuthenticatedUser { id, username: _}: AuthenticatedUser,
    Path(slug): Path<String>,
    State(pool): State<Pool<Postgres>>,
    Json(clue): Json<Clue>,
) -> (StatusCode, Json<String>) {

    println!("here");
    let board: Result<i32, sqlx::Error> = sqlx::query_scalar("SELECT id FROM boards WHERE slug = $1 AND user_id = $2")
        .bind(&slug)
        .bind(id)
        .fetch_one(&pool)
        .await;

    let board_id = match board {
        Err(_) => return (StatusCode::NOT_FOUND, Json("This is not yours to edit....".to_string())),
        Ok(id) => id
    };

    let result = sqlx::query("UPDATE board_clues SET clue = $1, response = $2 WHERE board_id = $3 AND position = $4")
        .bind(clue.clue)
        .bind(clue.response)
        .bind(board_id)
        .bind(clue.position)
        .execute(&pool)
        .await;

    match result {
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Json(slug)),
        Ok(_) => (StatusCode::OK, Json(slug))
    }

}

pub async fn get_random_question() -> (StatusCode, Json<ExternalBoard>) {
    let mut external_api = env::var("EXTERNAL_CLUE_API")
        .expect("Please set the extenal clue API. Should be something called cluebase");
    external_api.push_str("/clues?limit=60");

    // clean this immediately after done testing
    let result: Result<reqwest::Response, reqwest::Error> = reqwest::get(external_api).await;

    match result {
        Ok(response) => {
            let clues: ExternalBoard = response.json().await.unwrap();

            (StatusCode::ACCEPTED, Json(clues))
        }
        Err(e) => (
            StatusCode::NOT_FOUND,
            Json(ExternalBoard {
                status: e.to_string(),
                // this is so incredibly stupid i dont know im just gonna do this for now tho
                data: Vec::new()
            }),
        ),
    }
}



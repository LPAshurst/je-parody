use axum::extract::Json;
use axum::{Router, extract::State, routing::post};

use reqwest::StatusCode;
use sqlx::{Pool, Postgres};

use crate::models::board::Board;
use crate::models::user::AuthenticatedUser;

pub fn board_routes() -> Router<Pool<Postgres>> {
    Router::new().route("/save_full_board", post(save_full_board))
}

pub async fn save_full_board(
    AuthenticatedUser { id, username}: AuthenticatedUser,
    State(pool): State<Pool<Postgres>>,
    Json(board): Json<Board>,
) -> (StatusCode, Json<String>) {
    let board_result = sqlx::query_scalar!(
        "INSERT INTO boards (user_id, board_name) VALUES ($1, $2) RETURNING id",
        id,
        board.title
    )
    .fetch_one(&pool)
    .await;

    let board_id = match board_result {
        Ok(board_id) => board_id,

        Err(_) => {
            return (
                StatusCode::NOT_FOUND,
                Json(format!("Can't save board to database at this time")),
            );
        }
    };

    let clues = board.clues;

    let clue_vals: Vec<i32> = clues.iter().map(|c| c.clue_val).collect();
    let daily_doubles: Vec<bool> = clues.iter().map(|c| c.daily_double).collect();
    let rounds: Vec<String> = clues.iter().map(|c| c.round.clone()).collect();
    let categories: Vec<String> = clues.iter().map(|c| c.category.clone()).collect();
    let clue_texts: Vec<String> = clues.iter().map(|c| c.clue.clone()).collect();
    let responses: Vec<String> = clues.iter().map(|c| c.response.clone()).collect();
    let clue_is_pictures: Vec<bool> = clues.iter().map(|c| c.clue_is_picture).collect();
    let positions: Vec<i32> = clues.iter().map(|c| c.position).collect();

    let clue_insert_result = sqlx::query(
    "INSERT INTO board_clues (board_id, clue_val, daily_double, round, category, clue, response, clue_is_picture, position)
        SELECT $1, * FROM UNNEST ($2::int[], $3::bool[], $4::text[], $5::text[], $6::text[], $7::text[], $8::bool[], $9::int[])"
    )
    .bind(board_id)
    .bind(clue_vals)
    .bind(daily_doubles)
    .bind(rounds)
    .bind(categories)
    .bind(clue_texts)
    .bind(responses)
    .bind(clue_is_pictures)
    .bind(positions)
    .execute(&pool)
    .await;

    match clue_insert_result {
        Ok(_) => return (StatusCode::OK, Json(username)),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to save clues".to_string()))
    }


    
}

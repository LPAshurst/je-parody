use std::env;

use axum::extract::{Json, Path};
use axum::{Router, extract::State, routing::post, routing::get, routing::put};

use reqwest::StatusCode;
use sqlx::{Pool, Postgres};

use crate::extractors::optional_user::{OptionalUser};
use crate::models::clues::Clue;
use crate::models::user::AuthenticatedUser;

use crate::models::board::{Board, ExternalBoard, InternalBoard, UpdateCategoryRequest};

use crate::misc::slug::generate_unique_slug;

pub fn board_routes() -> Router<Pool<Postgres>> {
    Router::new()
    .route("/save_full_board", post(save_full_board))
    .route("/random_board", get(random_board))
    .route("/request_board/{slug}", get(request_board))
    .route("/request_user_boards", get(request_user_boards))
    .route("/update_category/{slug}", put(update_category))
}


async fn request_user_boards(
    OptionalUser(optional_user): OptionalUser,
    State(pool): State<Pool<Postgres>>,
) -> (StatusCode, Json<Vec<InternalBoard>>) {


    if let Some(user) = optional_user {
        
        let boards_query = sqlx::query_as!(Board, "SELECT * FROM boards WHERE user_id = $1", user.id)
        .fetch_all(&pool)
        .await;

        match boards_query {
            Ok(boards ) => {

                let internal_boards = boards.into_iter().map(|b| InternalBoard {title: b.board_name, slug: b.slug, clues: Vec::new()} ).collect();

                return (StatusCode::OK, Json(internal_boards));

            },
            Err(_) => {
                return (StatusCode::NOT_FOUND, Json(Vec::new()));
            }
        }
    } else {
        return (StatusCode::NOT_FOUND, Json(Vec::new()));
    }


}


async fn request_board(
    OptionalUser(optional_user): OptionalUser,
    Path(slug): Path<String>,
    State(pool): State<Pool<Postgres>>,
) -> (StatusCode, Json<InternalBoard>) {    

    let user_id = optional_user.map(|u| u.id);

    let board: Result<Board, sqlx::Error> = sqlx::query_as("SELECT * FROM boards WHERE slug = $1 AND ($2::INTEGER IS NULL OR user_id = $2 OR is_public = true)")
        .bind(slug)
        .bind(user_id)
        .fetch_one(&pool)
        .await;

    match board {
        Ok(board) => {
            // need to get clues now

            let clues: Result<Vec<Clue>, sqlx::Error> = sqlx::query_as("SELECT * FROM board_clues WHERE board_id = $1 ORDER BY position ASC")
                .bind(board.id)
                .fetch_all(&pool)
                .await;

            match clues {
                Ok(clues) => return (StatusCode::OK, Json(InternalBoard {title: board.board_name, slug: board.slug, clues: clues})),
                Err(_) => return (StatusCode::NOT_FOUND, Json(InternalBoard {title: "".to_string(), slug: "".to_string(), clues: Vec::new()}))
            }


        },
        Err(_) => return (StatusCode::NOT_FOUND, Json(InternalBoard {title: "".to_string(), slug: "".to_string(), clues: Vec::new()}))
    }

}

async fn random_board() -> (StatusCode, Json<ExternalBoard>) {
    let mut external_api = env::var("EXTERNAL_CLUE_API")
        .expect("Please set the extenal clue API. Should be something called cluebase");
    external_api.push_str("/random_board");

    let response = reqwest::get(external_api).await;

    match response {
        Ok(response) => {
            let board: ExternalBoard = response.json().await.unwrap();

            (StatusCode::ACCEPTED, Json(board))
        }
        Err(e) => (
            StatusCode::NOT_FOUND,
            Json(ExternalBoard {
                status: e.to_string(),
                data: Vec::new(),
            }),
        ),
    }
}

async fn save_full_board(
    AuthenticatedUser { id, username: _}: AuthenticatedUser,
    State(pool): State<Pool<Postgres>>,
    Json(board): Json<InternalBoard>,
) -> (StatusCode, Json<String>) {

    let slug = match generate_unique_slug(&pool, id, &board.title).await {
        Ok(s) => s,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to generate slug".to_string()))
    };

    let board_result = sqlx::query_scalar!(
        "INSERT INTO boards (user_id, board_name, slug) VALUES ($1, $2, $3) RETURNING id",
        id,
        board.title,
        slug
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
        Ok(_) => return (StatusCode::OK, Json(slug)),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to save clues".to_string()))
    }

}


async fn update_category(
    AuthenticatedUser { id, username: _}: AuthenticatedUser,
    State(pool ): State<Pool<Postgres>>,
    Path(slug): Path<String>,
    Json(cat_req): Json<UpdateCategoryRequest>,
) -> StatusCode {

        
    let board_id: Result<i32, sqlx::Error> = sqlx::query_scalar(
        "SELECT id FROM boards WHERE slug = $1 AND user_id = $2"
    )
    .bind(&slug)
    .bind(id)
    .fetch_one(&pool)
    .await;


    if let Ok(board_id) = board_id {

        let result = sqlx::query(
            "UPDATE board_clues SET category = $1 WHERE board_id = $2 AND position % 6 = $3"
        )
        .bind(&cat_req.new_category_name)
        .bind(board_id)
        .bind(cat_req.category_index)
        .execute(&pool)
        .await;

        match result {
            Ok(_) => return StatusCode::OK,
            Err(_) => return StatusCode::CONFLICT
        }
        
    } else {
        return StatusCode::NOT_FOUND;
    }


}

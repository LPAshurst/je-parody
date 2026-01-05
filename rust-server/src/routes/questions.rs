use std::env;

use crate::models::{questions::ExternalClueResponse};
use axum::{
    Router,
    routing::{get},
};
use axum::{
    extract::Json
};


use reqwest::StatusCode;
use sqlx::{Pool, Postgres};


pub fn question_routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/random_question", get(get_random_question))
        .route("/random_board", get(random_board))
}

pub async fn get_random_question() -> (StatusCode, Json<ExternalClueResponse>) {

    let mut external_api = env::var("EXTERNAL_CLUE_API").expect("Please set the extenal clue API. Should be something called cluebase");
    external_api.push_str("/clues?limit=60");

    // clean this immediately after done testing
    let result = reqwest::get(external_api).await;

    match result {
        Ok(response) => {
            let clues: ExternalClueResponse = response.json().await.unwrap();

            (StatusCode::ACCEPTED, Json(clues))
        },
        Err(e) => {
            (StatusCode::NOT_FOUND, Json(ExternalClueResponse {status: e.to_string(), data: Vec::new()}))
        }
    }
    
}

pub async fn random_board() -> (StatusCode, Json<ExternalClueResponse>) {

    let mut external_api = env::var("EXTERNAL_CLUE_API").expect("Please set the extenal clue API. Should be something called cluebase");
    external_api.push_str("/random_board");

    // clean this immediately after done testing
    let response = reqwest::get(external_api).await;
    
    match response {
        Ok(response) => {
            let clues: ExternalClueResponse = response.json().await.unwrap();

            (StatusCode::ACCEPTED, Json(clues))
        },
        Err(e) => {
            (StatusCode::NOT_FOUND, Json(ExternalClueResponse {status: e.to_string(), data: Vec::new()}))
        }
    }

}
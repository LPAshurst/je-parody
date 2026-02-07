mod board;
mod clues;
mod users;

use axum::{
    Router,
    http::{Method, header},
    routing::{get, post},
};
use sqlx::PgPool;
use tower_cookies::CookieManagerLayer;
use tower_http::cors::CorsLayer;
use socketioxide::{
    SocketIo,
};

use crate::socket::state;

use crate::socket::handlers::on_game_connect;

pub fn create_router(pool: PgPool) -> Router {
    let origins = [
        "http://192.168.1.249:5173".parse().unwrap(),
        "http://192.168.1.249:4173".parse().unwrap(),
        "http://192.168.1.248:5173".parse().unwrap(),
        "http://192.168.1.248:4173".parse().unwrap(),
        "http://api.example.com".parse().unwrap(),
        "http://lorenzopi.local:5173".parse().unwrap(),
        "http://lorenzopi.local:4173".parse().unwrap(),
        "https://elsy-unrude-jemma.ngrok-free.dev".parse().unwrap(), // dev proxy
    ];

    let cors_layer = CorsLayer::new()
        .allow_origin(origins)
        .allow_credentials(true)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS, Method::PUT])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);

    let games = state::GameStore::default();

    let (socket_layer, io) = SocketIo::builder().with_state(games).build_layer();

    io.ns("/", on_game_connect);
        
    Router::new()
        .route("/", get(|| async { "Hello World!" }))
        .nest("/user", users::user_routes())
        .nest("/clues", clues::question_routes())
        .nest("/boards", board::board_routes())
        .route("/postExample", post(|| async { "posting" }))
        .with_state(pool)
        .layer(CookieManagerLayer::new())
        .layer(socket_layer)
        .layer(cors_layer)

}

mod users;

use axum::{
    routing::{get, post}, Router,
};
use sqlx::{PgPool};
use tower_http::cors::{Any, CorsLayer};


pub fn create_router(pool: PgPool) -> Router {

    let cors_layer = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);

    Router::new()
    .route("/", get(|| async {"Hello World!"}))
    .nest("/user", users::routes())
    .route("/post_example", post(|| async {"posting"}))
    .with_state(pool)
    .layer(cors_layer)

}
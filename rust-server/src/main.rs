mod database;
mod extractors;
mod models;
mod routes;
mod misc;

use tokio;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().unwrap();

    let pool = database::new_pool().await.unwrap();

    let app = routes::create_router(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

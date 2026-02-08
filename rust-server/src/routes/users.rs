use crate::{extractors::optional_user::OptionalUser, models::user::{CreateAndCheckUser, User}};
use axum::{
    Router,
    routing::{get, post},
};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use bcrypt::{DEFAULT_COST, verify};
use chrono::{Duration, Utc};
use sqlx::{Pool, Postgres};
use tower_cookies::{Cookie, Cookies};
use uuid::Uuid;

pub fn user_routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
        .route("/confirm_session", get(confirm_session))
}

async fn confirm_session(OptionalUser(optional_user): OptionalUser) -> (StatusCode, Json<String>) {

    if let Some(user) = optional_user {
        return (StatusCode::OK, Json(user.username));
    } else {
        return (StatusCode::NOT_FOUND, Json("".to_string()));
    }

}
async fn login(
    State(pool): State<Pool<Postgres>>,
    cookies: Cookies,
    Json(credentials): Json<CreateAndCheckUser>,
) -> (StatusCode, Json<String>) {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1")
        .bind(&credentials.username)
        .fetch_optional(&pool)
        .await
        .unwrap();

    let user = match user {
        Some(u) => u,
        None => return (StatusCode::UNAUTHORIZED, Json("Wrong user or pass".into())),
    };

    let valid = verify(&credentials.password, &user.password_hash).unwrap_or(false);

    if !valid {
        return (StatusCode::UNAUTHORIZED, Json("Wrong user or pass".into()));
    }

    let session_token = Uuid::new_v4();
    let expires_at = Utc::now() + Duration::days(7);

    sqlx::query("INSERT INTO sessions (session_token, user_id, expires_at) VALUES ($1, $2, $3)")
        .bind(session_token)
        .bind(user.id)
        .bind(expires_at)
        .execute(&pool)
        .await
        .unwrap();

    let mut cookie = Cookie::new("session_token", session_token.to_string());
    cookie.set_http_only(true);
    cookie.set_path("/");
    cookie.set_max_age(tower_cookies::cookie::time::Duration::days(7));

    cookies.add(cookie);

    return (
        StatusCode::CREATED,
        Json(user.username), // give the user their username back : D
    );
}

async fn signup(
    State(pool): State<Pool<Postgres>>,
    cookies: Cookies,
    Json(new_user): Json<CreateAndCheckUser>,
) -> (StatusCode, Json<String>) {
    let password_hash = bcrypt::hash(&new_user.password, DEFAULT_COST).unwrap();

    let result = sqlx::query!(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
        &new_user.username,
        &password_hash
    )
    .fetch_one(&pool)
    .await;

    match result {
        Ok(user) => {
            let session_token = Uuid::new_v4();
            let expires_at = Utc::now() + Duration::days(7);

            sqlx::query(
                "INSERT INTO sessions (session_token, user_id, expires_at) VALUES ($1, $2, $3)",
            )
            .bind(session_token)
            .bind(user.id)
            .bind(expires_at)
            .execute(&pool)
            .await
            .unwrap();

            let mut cookie = Cookie::new("session_token", session_token.to_string());
            cookie.set_http_only(true);
            cookie.set_path("/");
            cookie.set_max_age(tower_cookies::cookie::time::Duration::days(7));

            cookies.add(cookie);
            (
                StatusCode::CREATED,
                Json(new_user.username), // give the user their username back : D,
            )
        }
        Err(sqlx::Error::Database(db_err)) => {
            // Postgres unique violation = 23505
            if db_err.code().as_deref() == Some("23505") {
                (StatusCode::CONFLICT, Json("Username already exists".into()))
            } else {
                eprintln!("Database error: {}", db_err);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json("Database error".into()),
                )
            }
        }

        Err(e) => {
            eprintln!("Unknown error: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json("Internal server error".into()),
            )
        }
    }
}

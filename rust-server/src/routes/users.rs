use axum::{extract::{Json, State}, http::StatusCode};
use bcrypt::{DEFAULT_COST, verify};
use chrono::{Utc, Duration};
use sqlx::{Postgres, Pool};
use tower_cookies::{Cookie, Cookies};
use crate::models::user::{CreateAndCheckUser, User, UserSession};
use axum::{
    routing::{get, post}, Router,
};
use uuid::Uuid;

pub fn routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/signup", post(signup))              
        .route("/login", post(login)) 
        .route("/confirm_session", get(confirm_session))     
}

async fn confirm_session(
    State(pool): State<Pool<Postgres>>, 
    cookie: Cookies
) -> StatusCode {
    if let Some(session) = cookie.get("session_token") {
        let session_token = match Uuid::parse_str(session.value()) {
            Ok(uuid) => uuid,
            Err(_) => return StatusCode::UNAUTHORIZED,
        };
        let token_in_db: Result<UserSession, sqlx::Error> = sqlx::query_as("SELECT * FROM sessions WHERE session_token = $1")
            .bind(session_token)
            .fetch_one(&pool)
            .await;
        match token_in_db {
            Ok(_) => StatusCode::OK,
            Err(e) => {
                println!("{e}");
                StatusCode::NOT_FOUND
            }
        }

    } else {
        println!("No cookie found");
        StatusCode::NOT_FOUND
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

    return (StatusCode::CREATED, Json(format!("Cookie made for {}", user.username).into()));


}

async fn signup(State(pool): State<Pool<Postgres>>, cookies: Cookies, Json(new_user): Json<CreateAndCheckUser>) -> (StatusCode, Json<String>) {

    let password_hash = bcrypt::hash(&new_user.password, DEFAULT_COST).unwrap();

    let result = sqlx::query!("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id", &new_user.username, &password_hash)
        .fetch_one(&pool)
        .await;

    match result {
        Ok(user) => {

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
            (StatusCode::CREATED, Json(String::from("Successfully signed up")))
            
        },
        Err(sqlx::Error::Database(db_err)) => {
            // Postgres unique violation = 23505
            if db_err.code().as_deref() == Some("23505") {
                (
                    StatusCode::CONFLICT,
                    Json("Username already exists".into()),
                )
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
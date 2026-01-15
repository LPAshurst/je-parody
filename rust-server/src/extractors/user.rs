use crate::models::user::{AuthenticatedUser, User, UserSession};
use axum::extract::{FromRef, FromRequestParts};
use axum::http::StatusCode;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

impl<S> FromRequestParts<S> for AuthenticatedUser
where
    S: Send + Sync,
    Pool<Postgres>: FromRef<S>,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        state: &S,
    ) -> Result<Self, Self::Rejection> {

        println!("I got to this fpr extractor");

        let pool = Pool::<Postgres>::from_ref(state);

        let cookie = tower_cookies::Cookies::from_request_parts(parts, state).await?;

        if let Some(session) = cookie.get("session_token") {
            let session_token = match Uuid::parse_str(session.value()) {
                Ok(uuid) => uuid,
                Err(_) => return Err((StatusCode::UNAUTHORIZED, "Your cookie is out of date")),
            };

            // make sure we have the session
            let token_in_db: Result<UserSession, sqlx::Error> =
                sqlx::query_as("SELECT * FROM sessions WHERE session_token = $1")
                    .bind(session_token)
                    .fetch_one(&pool)
                    .await;

            let user_session = match token_in_db {
                Ok(session) => session,
                Err(_) => {
                    return Err((StatusCode::NOT_FOUND, "Could not find a cookie for you :("));
                }
            };

            let user_in_db: Result<User, sqlx::Error> =
                sqlx::query_as("SELECT * FROM users WHERE id = $1")
                    .bind(user_session.user_id)
                    .fetch_one(&pool)
                    .await;

            match user_in_db {
                Ok(user) => {
                    return Ok(AuthenticatedUser {
                        id: user.id,
                        username: user.username,
                    });
                }
                Err(_) => {
                    return Err((
                        StatusCode::NOT_FOUND,
                        "Somehow you have a session with no user",
                    ));
                }
            }
        } else {
            return Err((StatusCode::NOT_FOUND, "Could not find a cookie for you :("));
        }
    }
}

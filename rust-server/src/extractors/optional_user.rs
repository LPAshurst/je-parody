use axum::extract::{FromRef, FromRequestParts};
use sqlx::{Pool, Postgres};

use crate::models::user::AuthenticatedUser;

pub struct OptionalUser(pub Option<AuthenticatedUser>);

impl<S> FromRequestParts<S> for OptionalUser
where  
    S: Send + Sync,
    Pool<Postgres>: FromRef<S>
{

    type Rejection = std::convert::Infallible;
    
    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        state: &S,
    ) -> Result<Self, Self::Rejection> {

        match AuthenticatedUser::from_request_parts(parts, state).await {
            Ok(user) => Ok(OptionalUser(Some(user))),
            Err(_) => Ok(OptionalUser(None))
        }


    }

}
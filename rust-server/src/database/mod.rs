use sqlx::postgres::PgPoolOptions;
use sqlx::{Postgres, Pool};
use std::env;

pub async fn new_pool() -> Result<Pool<Postgres>, sqlx::Error> {

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    println!("{database_url}");
    let pool: sqlx::Pool<sqlx::Postgres> = PgPoolOptions::new() 
        .max_connections(5)
        .connect(&database_url).await?;

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    Ok(pool)

}

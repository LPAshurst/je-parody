use sqlx::{Pool, Postgres};

fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

pub async fn generate_unique_slug(
    pool: &Pool<Postgres>,
    user_id: i32,
    board_name: &str,
) -> Result<String, sqlx::Error> {
    let base_slug = slugify(board_name);
    let mut slug = base_slug.clone();
    let mut counter = 2;
    
    loop {
        let exists = sqlx::query_scalar!(
            "SELECT EXISTS(SELECT 1 FROM boards WHERE user_id = $1 AND slug = $2)",
            user_id,
            slug
        )
        .fetch_one(pool)
        .await?;
        
        if !exists.unwrap_or(false) {
            return Ok(slug);
        }
        
        slug = format!("{}-{}", base_slug, counter);
        counter += 1;
    }
}
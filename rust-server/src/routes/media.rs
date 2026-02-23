use axum::{Json, Router, routing::post};
use reqwest::{StatusCode, multipart};
use sqlx::{Pool, Postgres};
use std::env;


pub fn media_routes() -> Router<Pool<Postgres>> {
    Router::new()
        .route("/upload_image", post(upload_image))
}

async fn upload_image(
    headers: axum::http::HeaderMap,
    mut multipart: axum::extract::Multipart,
) -> Result<Json<serde_json::Value>, StatusCode> {

    // make sure image isnt huge
    if let Some(content_length) = headers.get("content-length") {
        if let Ok(len) = content_length.to_str().unwrap_or("0").parse::<usize>() {
            if len > 5 * 1024 * 1024 {
                return Err(StatusCode::PAYLOAD_TOO_LARGE);
            }
        }
    }

    let api_key = env::var("CLOUDINARY_API_KEY")
        .expect("Please set the cloudinary api key. should be located here https://console.cloudinary.com/app/settings/api-keys");

    let api_secret = env::var("CLOUDINARY_API_SECRET")
        .expect("Please set the cloudinary api secret. should be located here https://console.cloudinary.com/app/settings/api-keys");

    let cloud_name = env::var("CLOUD_NAME")
        .expect("Please set the cloud name env var. should be located here https://console.cloudinary.com/app/settings/api-keys");

    let client = reqwest::Client::new();

    while let Some(field) = multipart.next_field().await.unwrap() {
        let data = field.bytes().await.unwrap();

        // check one more time just in case
        if data.len() > 5 * 1024 * 1024 {
            return Err(StatusCode::PAYLOAD_TOO_LARGE);
        }
        
        let form = multipart::Form::new()
            .part("file", multipart::Part::bytes(data.to_vec())
                .file_name("upload.jpg")
                .mime_str("image/jpeg").unwrap()
            );

        let res = client
            .post(format!("https://api.cloudinary.com/v1_1/{}/image/upload", cloud_name))
            .basic_auth(api_key, Some(api_secret))
            .multipart(form)
            .send()
            .await
            .unwrap();
            
        let json: serde_json::Value = res.json().await.unwrap();
        println!("Cloudinary response: {}", json);  // add this
        let url = json["secure_url"].as_str().unwrap();
        
        return Ok(Json(serde_json::json!({ "url": url })));
    }
    Err(StatusCode::BAD_REQUEST)
}
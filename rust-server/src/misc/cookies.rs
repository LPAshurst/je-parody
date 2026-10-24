use tower_cookies::{Cookie, cookie::{SameSite, time::Duration}};
use uuid::Uuid;

pub fn session_cookie(token: Uuid) -> Cookie<'static> {
    let mut cookie = Cookie::new("session_token", token.to_string());
    cookie.set_http_only(true);
    cookie.set_path("/");
    cookie.set_max_age(Duration::days(7));

    // 🚨 MANDATORY FOR GITHUB PAGES -> NGROK PIPELINE
    // SameSite::None allows the cookie to be sent across different root domains.
    cookie.set_same_site(SameSite::None);
    // Secure(true) is strictly required by browsers if SameSite is None.
    cookie.set_secure(true); 

    cookie
}
use rand::Rng;
use crate::models::gamestate::Game;

// Generate random room code, implementation should be fine for sparse gamelists
pub fn generate_code() -> String {
    let mut rng = rand::rng();

    let code: String = (0..4)
        .map(|_| {
            let idx: u8 = rng.random_range(0..36);
            if idx < 10 {
                (b'0' + idx) as char
            } else {
                (b'a' + (idx - 10)) as char
            }
        })
        .collect();
    return code;
}

pub fn forfeit_clue(game: &mut Game) -> Option<()> {
    for player in game.players.values_mut() {
        player.has_answered = false;
    }
    game.current_clue_position = None;
    game.buzzer_locked = true;
    Some(())
}
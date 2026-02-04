use crate::models::clues::Clue;



pub struct Game {

    players: Vec<Player>,
    clues: Vec<Clue>,
    answering_question: bool,

}

pub struct Player {

    points: i32,
    username: String

}

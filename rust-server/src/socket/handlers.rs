use serde::Deserialize;
use socketioxide::extract::{Data, SocketRef, State};

use crate::{socket::state::{self, GameClue, Player}};


#[derive(Deserialize, Debug)]
struct JoinGameData {
    room_id: String,
    user_name: String,
}

#[derive(Deserialize, Debug, serde::Serialize)]
struct StartGameData {
    room_id: String,
    clues: Vec<GameClue>,
    players: Vec<String>,
}

#[derive(Deserialize, Debug)]
struct ResponseData {
    room_id: String,
    correct_response: bool,
}

#[derive(Deserialize, Debug)]
struct SelectedClueData {
    room_id: String,
    position: usize,
}


async fn join_game(s: SocketRef, Data(game_data): Data<JoinGameData>, store: State<state::GameStore>) {
    s.join(game_data.room_id.clone()); 
    store.add_player(&game_data.room_id, 
        Player {
            score: 0, 
        },
        game_data.user_name.to_string()

    ).await;

    let _ = s.to(game_data.room_id.clone()).emit("user-joined", &game_data.user_name).await;
}

async fn create_game(s: SocketRef, store: State<state::GameStore>) {
    let game = store.create_game().await;
    s.join(game.code.clone());
    let _ = s.emit("room-code", &game.code);
    println!("I got to the end the room should be made");

}

async fn update_game(s: SocketRef, store: State<state::GameStore>, room_id: &str) {

    let game = store.get_game(room_id).await.unwrap();
    let code = game.code.clone();
    let _ = s.to(code).emit("get-state", &game).await;

}

async fn ask_for_state(s: SocketRef, Data(room_id): Data<String>, store: State<state::GameStore>) {
    let rooms = s.rooms();
    println!("All rooms in the / namespace: {:?}", rooms);
    let game = store.get_game(&room_id).await.unwrap();
    let _ = s.emit("get-state", &game);

}


async fn rejoin_room(s: SocketRef, Data(room_id): Data<String>) {
    println!("rejoining....");
    s.join(room_id);

}

async fn start_game(s: SocketRef, Data(start_game_data): Data<StartGameData>, store: State<state::GameStore>) {

    println!("{:?}", start_game_data.clues);
    let game = store.initialize_game(&start_game_data.room_id, start_game_data.clues.clone(), start_game_data.players).await;
    let code: String = game.code.clone();
    let _ = s.to(code.clone()).emit("navigate-to-start", &game.code).await;
    let _ = s.to(code).emit("get-state", &game).await;

}

pub async fn on_game_connect(socket: SocketRef) {
        
    socket.on("join-game", join_game);

    socket.on("create-game", create_game);

    socket.on("start-game", start_game);
    
    socket.on("buzz_in", handle_buzz_in);

    socket.on("board_response", handle_board_response);

    socket.on("select-clue", handle_selected_clue);

    socket.on("ask-for-state", ask_for_state);

    socket.on("rejoin-room", rejoin_room);

    // socket.on("submit_answer", handle_submit_answer);
    // socket.on("start_round", handle_start_round);
    // socket.on("select_clue", handle_select_clue);
    
    // Handle disconnect
    // socket.on_disconnect(|socket: SocketRef| {
    //     println!("Player disconnected: {}", socket.id);
    // });
}

async fn handle_selected_clue(s: SocketRef, Data(response_data): Data<SelectedClueData>, store: State<state::GameStore>) {

    store.select_clue(&response_data.room_id, response_data.position).await;
    update_game(s, store, &response_data.room_id).await;

}

async fn handle_buzz_in(s: SocketRef, Data(response_data): Data<JoinGameData>,  store: State<state::GameStore>) {

    store.buzz_in(&response_data.room_id, &response_data.user_name).await;
    update_game(s, store, &response_data.room_id).await;

}

async fn handle_board_response(s: SocketRef, Data(response_data): Data<ResponseData>,  store: State<state::GameStore>) {

    store.update_score(&response_data.room_id, response_data.correct_response).await;
    update_game(s, store, &response_data.room_id).await;
}


// fn handle_submit_answer(socket: SocketRef, Data::<AnswerData>(data)) {
//     // Your game logic here
//     let is_correct = check_answer(&data.answer, &data.clue_id);
    
//     socket.emit("answer_result", AnswerResult {
//         correct: is_correct,
//         points: if is_correct { data.points } else { -data.points }
//     }).ok();
// }
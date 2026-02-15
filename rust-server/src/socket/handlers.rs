use crate::models::gamestate::{GameStore, JoinGameData, ManualIncrementData, Player, ResponseData, SelectedClueData, StartGameData};
use socketioxide::extract::{Data, SocketRef, State};

pub async fn on_game_connect(socket: SocketRef) {
        
    socket.on("join-game", join_game);

    socket.on("create-game", create_game);

    socket.on("start-game", start_game);
    
    socket.on("buzz_in", handle_buzz_in);

    socket.on("board_response", handle_board_response);

    socket.on("select-clue", handle_selected_clue);

    socket.on("close-clue", handle_closed_clue);

    socket.on("ask-for-state", ask_for_state);

    socket.on("rejoin-room", rejoin_room);

    socket.on("manual-points", handle_manual_points)

}

async fn join_game(s: SocketRef, Data(game_data): Data<JoinGameData>, store: State<GameStore>) {
    match store.add_player(&game_data.room_id, 
        Player {
            score: 0, 
            has_answered: false
        },
        &game_data.user_name

    ).await {
        Ok(_) => {
                s.join(game_data.room_id.clone()); 
                let _ = s.within(game_data.room_id.clone()).emit("user-joined", &game_data.user_name).await;
        },
        Err(_) => println!("Something is broken")
    }
    
}

async fn create_game(s: SocketRef, store: State<GameStore>) {
    let game = store.create_game().await;
    s.join(game.code.clone());
    let _ = s.emit("room-code", &game.code);
}

async fn update_game(s: SocketRef, store: State<GameStore>, room_id: &str) {

    let game = store.get_game(room_id).await;
    if let Some(game) = game {
        let code = game.code.clone();
        let _ = s.within(code).emit("get-state", &game).await;
    } else {
        // something went seriousely wrong the game doesnt exist anymore
        // FIXME add some sort of logic
    }
}

async fn ask_for_state(s: SocketRef, Data(room_id): Data<String>, store: State<GameStore>) {    
    let game = store.get_game(&room_id).await;
    if let Some(game) = game {
        let _ = s.emit("get-state", &game);
    } else {
        // game doesnt exist inform frontend
    }

}

async fn rejoin_room(s: SocketRef, Data(room_id): Data<String>) {
    s.join(room_id);
}

async fn start_game(s: SocketRef, Data(start_game_data): Data<StartGameData>, store: State<GameStore>) {
    let game = store.initialize_game(&start_game_data.room_id, start_game_data.clues.clone()).await;
    if let Some(game) = game {
        let code: String = game.code.clone();
        let _ = s.to(code.clone()).emit("navigate-to-start", &game.code).await;
        let _ = s.within(code).emit("get-state", &game).await;
    }
    // handle logic to probably tell user to leave the room and go back to home page
}



async fn handle_selected_clue(s: SocketRef, Data(response_data): Data<SelectedClueData>, store: State<GameStore>) {
    match store.select_clue(&response_data.room_id, response_data.position).await {
        Ok(_) => update_game(s, store, &response_data.room_id).await,
        Err(_) => println!("Something is broken")
    }
        

}

async fn handle_closed_clue(s: SocketRef, Data(room_id): Data<String>, store: State<GameStore>) {
    match store.close_clue(&room_id).await {
        Ok(_) => update_game(s, store, &room_id).await,
        Err(_) => println!("No game please fix")
    }
}

async fn handle_buzz_in(s: SocketRef, Data(response_data): Data<JoinGameData>,  store: State<GameStore>) {

    match store.buzz_in(&response_data.room_id, &response_data.user_name).await {
        Ok(_) => update_game(s, store, &response_data.room_id).await,
        Err(_) => println!("No game")
    }
    

}

async fn handle_board_response(s: SocketRef, Data(response_data): Data<ResponseData>,  store: State<GameStore>) {

    match store.update_score(&response_data.room_id, response_data.correct_response).await {
        Ok(_) => update_game(s, store, &response_data.room_id).await,
        Err(_) => println!("Something is broken")
    }
    

}

async fn handle_manual_points(s: SocketRef, Data(response_data): Data<ManualIncrementData>, store: State<GameStore>) {

    match store.update_manual_score(&response_data.room_id, &response_data.user_name, response_data.amount).await {
        Ok(_) => update_game(s, store, &response_data.room_id).await,
        Err(_) => println!("No gmae or player fix me")
    }
    

}

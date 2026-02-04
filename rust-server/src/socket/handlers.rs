// use socketioxide::extract::{Data, SocketRef};

// pub fn on_game_connect(socket: SocketRef) {
//     println!("Player connected: {}", socket.id);
    
//     // Register multiple event handlers on this one socket
//     socket.on("join_game", handle_join_game);
//     socket.on("buzz_in", handle_buzz_in);
//     socket.on("submit_answer", handle_submit_answer);
//     socket.on("start_round", handle_start_round);
//     socket.on("select_clue", handle_select_clue);
    
//     // Handle disconnect
//     socket.on_disconnect(|socket: SocketRef| {
//         println!("Player disconnected: {}", socket.id);
//     });
// }


// fn handle_join_game(socket: SocketRef, Data::<JoinGameData>(data)) {
//     // Join a specific game room
//     socket.join(data.game_id.clone()).ok();
    
//     // Notify others in the room
//     socket.within(data.game_id).emit("player_joined", data.player_name).ok();
// }

// fn handle_buzz_in(socket: SocketRef, Data::<BuzzData>(data)) {
//     // Broadcast to everyone in the game room
//     socket.within(data.game_id).emit("player_buzzed", BuzzEvent {
//         player_id: socket.id.to_string(),
//         timestamp: std::time::SystemTime::now(),
//     }).ok();
// }

// fn handle_submit_answer(socket: SocketRef, Data::<AnswerData>(data)) {
//     // Your game logic here
//     let is_correct = check_answer(&data.answer, &data.clue_id);
    
//     socket.emit("answer_result", AnswerResult {
//         correct: is_correct,
//         points: if is_correct { data.points } else { -data.points }
//     }).ok();
// }
-- Add migration script here
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    board_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE board_clues (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,  

    clue_val INTEGER NOT NULL,
    daily_double BOOLEAN,
    round VARCHAR(3),
    category VARCHAR(255) NOT NULL,
    clue TEXT NOT NULL,
    response TEXT NOT NULL,
    clue_is_picture BOOLEAN NOT NULL, 
    position INTEGER NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../types";
import { socket } from "../src/socket"
import { UseAuth } from "../context/AuthContext"

export default function HomePage() {

    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const auth = UseAuth();
    const [code, setCode] = useState("");

    useEffect(() => {
        socket.on("navigate-to-start", (room_id: string) => {
            setCode(room_id)
            navigate(`/player/${code}`)
        })
    }, [])

    async function getBoards() {
        const response = await fetch(
                `${import.meta.env.VITE_BACKEND_BOARD_API}/request_user_boards`, 
                { credentials: "include" }
        );
        
        const data: Board[] = await response.json();

        setBoards(data);

    }
    
    return (
        <>
            <button onClick={() => {navigate("../create")}}>press me to make a new board</button>
            <button onClick={() => {getBoards()}}>Click me to see list of boards</button>
            <button onClick={() => {socket.emit("join-game", {room_id: "rbfs", user_name: auth.userName})}}>join game</button>
            <ul>
                {boards.map((board, id) => (

                    <li key={id}>
                        <a href={`${import.meta.env.VITE_WEBSITE_URL}/setup/${board.slug}`}>{board.title}</a>
                    </li>

                ))}
            </ul>            
        </>
    )

}
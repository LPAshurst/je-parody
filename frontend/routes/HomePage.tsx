import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../types";

export default function HomePage() {

    const navigate = useNavigate();
    const [isNewBoard, setIsNewBoard] = useState(false);
    const [boards, setBoards] = useState<Board[]>([]);

    async function getBoards() {

        console.log("help")
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
            <ul>
                {boards.map((board, id) => (

                    <li key={id}>
                        <a href={`${import.meta.env.VITE_WEBSITE_URL}/play/${board.slug}`}>{board.title}</a>
                    </li>

                ))}
            </ul>            
        </>
    )

}
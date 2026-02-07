import "../styles/PlayBoard/PlayBoard.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Board, PlayClue } from "../types";
import JeopardyBoard from "../ui/PlayBoard/PlayJeopardyBoard";
import RoomCreationModal from "../ui/PlayBoard/RoomCreationModal"
import { socket } from "../src/socket";
import { useNavigate } from "react-router-dom";

export default function SetupPlayBoard() {
    
    const { slug } = useParams();
    const navigate = useNavigate();
    const [clues, setClues] = useState<PlayClue[]>([]);
    const [isOpen, _setOpen] = useState(true);
    const [boardName, setBoardName] = useState("");
    const [players, setPlayers] = useState<string[]>([]);
    const [roomCode, setroomCode] = useState("");
    const [makingRoom, setMakingRoom] = useState(false);
    

    function createRoom() {
        if (socket.connected) {
            socket.emit("create-game");
        }
        setMakingRoom(true)
    }

    function cancelRoom() {
        setMakingRoom(false)
        socket.emit("cancel-game", roomCode)
    }

    function startGame() {
        socket.emit("start-game", {room_id: roomCode, clues: clues, players: players})
        navigate(`/board/${roomCode}`)
    }

    useEffect(() => {

        const onRoomCode = (code: string) => {
            setroomCode(code);
        };

        const onUserJoined = (userName: string) => {
            console.log(userName)
            setPlayers(prev => [...prev, userName]);
        };

        socket.on("room-code", onRoomCode);
        socket.on("user-joined", onUserJoined);

        const getBoardData = async () => {

            // const res = await fetch(
            //     `${import.meta.env.VITE_BACKEND_BOARD_API}/request_board/${slug}`, 
            //     { credentials: "include" }
            // )
            const res = await fetch(
                `/api/boards/request_board/${slug}`, 
                { credentials: "include" }
            )
            if (!res.ok) {
                return;
            } else {
                const data: Board = await res.json();
                const newClues: PlayClue[] = data.clues.map((clue) => ({  
                    clue_val: clue.clue_val,
                    category: clue.category,
                    clue: clue.clue,
                    response: clue.response,
                    position: clue.position,
                    answered: false
                }));

                setClues(newClues);
                setBoardName(data.title)
            }

        }

        getBoardData()

        return () => {
            socket.off("room-code", onRoomCode);
            socket.off("user-joined", onUserJoined);
        };

    }, [])

    return (
        <>
            <RoomCreationModal slug={slug ? slug : ""} isOpen={isOpen} startGame={startGame} boardName={boardName} makingRoom={makingRoom} players={players} roomCode={roomCode} createRoom={createRoom} cancelRoom={cancelRoom}/>
            <div className="play-area">
                <JeopardyBoard clues={clues} handleClueClick={() => { } } isAnswering={false} answerQuestion={() => {}} handleCloseModal={() => {}}/>
            </div>
        </>
    )

}
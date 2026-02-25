import "../styles/PlayBoard/PlayBoard.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Board, PlayClue } from "../types";
import JeparodyBoard from "../ui/PlayBoard/PlayJeparodyBoard";
import RoomCreationModal from "../ui/PlayBoard/RoomCreationModal"
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

export default function SetupPlayBoard() {
    
    const { slug } = useParams();
    const navigate = useNavigate();
    const [clues, setClues] = useState<PlayClue[]>([]);
    const [isOpen, _setOpen] = useState(true);
    const [boardName, setBoardName] = useState("");
    const [players, setPlayers] = useState<string[]>([]);
    const [roomCode, setroomCode] = useState<string | undefined>("");
    const [makingRoom, setMakingRoom] = useState(false);
    const {socket} = useSocket();
    const [firstPlayer, setFirstPlayer] = useState("")

    function createRoom() {
        if (socket.connected) {
            socket.emit("create-game");
        }
        setMakingRoom(true)
    }

    function cancelRoom() {
        setMakingRoom(false)
        socket.emit("cancel-room", roomCode)
        setPlayers([])
    }

    function startGame() {
        if (roomCode) {
            socket.emit("start-game", {room_id: roomCode, clues: clues, player_picking_category: firstPlayer})
            navigate(`/board/${roomCode}`)
        }
    }

    useEffect(() => {

        const onRoomCode = (code: string) => {
            setroomCode(code);
        };

        const onUserJoined = (userName: string) => {
            setPlayers(prev => {
                const updated = [...prev, userName];
                setFirstPlayer(updated[0]);
                return updated;
            });
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
                    answered: false,
                    daily_double: clue.daily_double,
                    has_media: clue.clue_is_picture
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
            <RoomCreationModal slug={slug ? slug : ""} isOpen={isOpen} startGame={startGame} boardName={boardName} makingRoom={makingRoom} players={players} firstPlayer={firstPlayer} roomCode={roomCode!} createRoom={createRoom} cancelRoom={cancelRoom} setFirstPlayer={setFirstPlayer}/>
            <div className="play-area">
                <JeparodyBoard clues={clues} handleClueClick={() => { } } isAnswering={false} answerQuestion={() => {}} handleCloseModal={() => {}}/>
            </div>
        </>
    )

}
import Modal from "@mui/material/Modal";
import "../../styles/PlayBoard/RoomCreationModal.css"
interface RoomCreationModalProps {
    isOpen: boolean,
    startGame: () => void,
    boardName: string,
    makingRoom: boolean,
    players: string[],
    roomCode: string,
    createRoom: () => void,

}
export default function RoomCreationModal(
    {
        isOpen, 
        startGame, 
        boardName, 
        makingRoom, 
        players, 
        roomCode,
        createRoom
    }: RoomCreationModalProps
) {
    

    return (
        <Modal
        open={isOpen}
        onClose={(_, reason) => {
            if (reason === 'backdropClick') return;
        }}
        >
            <div className="modal-container">
                <div className="modal-content">

                    <h1 className="board-title">{boardName}</h1>
                    
                    <div className="game-controls">
                        {makingRoom ? 
                            <h1 style={{color: "#a1a1a1"}}>Room Code:</h1> 
                            : 
                            <button 
                                className={makingRoom ? "" : "animate" +  " start-button"} 
                                onClick={createRoom}
                            >
                                Create Room
                            </button>}

                        {makingRoom ? <div>{roomCode}</div> : <></>}
                    </div>
                    
                    <div className="fullscreen-hint">
                        Press <kbd>F11</kbd> for full-screen mode
                    </div>
                    {!makingRoom 
                    ?
                        <div className="action-links">
                            <a href="#">Edit</a> • <a href="#">Print</a> • <a href="#">Download</a> • <a href="#">Embed</a> • <a href="#">Share</a>
                        </div>
                    :
                        <div className="room-options">
                            <div>
                                <button onClick={startGame}>
                                    Play
                                </button>
                                <button>
                                    Cancel
                                </button>
                            </div>
                            <div className="joined-players">
                                <h2>Players ({players.length})</h2>
                                <div className="joined-player">
                                    {players.length > 0 ? (
                                        players.map((player, index) => (
                                            <div className="joined-player-box" key={index}>
                                                <div className="joined-player-name">{player}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: 'white', textAlign: 'center', padding: '1rem' }}>
                                            Waiting for players to join...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    }


                </div>
            </div>
        </Modal>
    );
    }



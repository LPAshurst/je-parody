import { Minus, Plus, Star } from "lucide-react";
import "../../styles/PlayBoard/PlayBoardFooter.css"
import type { Player } from "../../types";

interface PlayBoardFooterProps {
    players: Record<string, Player>
    currPlayer: string | null | undefined,
    handleManualPoints: (points: number, userName: string) => void
}

export default function PlayBoardFooter({players, currPlayer, handleManualPoints}: PlayBoardFooterProps) {
    
    return (
        <div className="footer-wrapper">
            {Object.keys(players).map((player_key, id) => (
                <div className="box-container" key={id}>
                    <Star size={25} color="#ffff80" style={{"visibility": currPlayer === player_key ? "visible" : "hidden"}}/>
                    <div className="player-box">
                        <div className="player-name">{player_key}</div>
                        <div className="player-points">{players[player_key].score}</div>
                        <div className="player-manual-points">
                            <Plus size={25} strokeWidth={2.5} color="#2da94e" onClick={() => handleManualPoints(100, player_key)} className="plus"/>
                            <Minus size={25} strokeWidth={2.5} color="#ff0000" onClick={() => handleManualPoints(-100, player_key)} className="minus"/> 
                        </div>
                    </div>
                </div>

            ))
            }
        </div>
    )
}
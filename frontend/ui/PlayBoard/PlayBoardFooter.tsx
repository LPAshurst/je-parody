import { Minus, Plus, Star } from "lucide-react";
import "../../styles/PlayBoard/PlayBoardFooter.css"
export default function PlayBoardFooter() {

const players = ["lorenzo", "michael", "mom", "dadda", "luna"];

    
    return (
        <div className="footer-wrapper">
            {players.map((player, id) => (
                <div className="box-container">
                    <Star size={25} color="#ffff80" style={{"visibility": "hidden"}}/>
                    <div className="player-box" key={id}>
                        <div className="player-name">{player}</div>
                        <div className="player-points">{0}</div>
                        <div className="player-manual-points">
                            <Plus size={25} strokeWidth={2.5} color="#2da94e" onClick={() => {}} className="plus"/>
                            <Minus size={25} strokeWidth={2.5} color="#ff0000" onClick={() => {}} className="minus"/> 
                        </div>
                    </div>
                </div>

            ))
            }
        </div>
    )
}
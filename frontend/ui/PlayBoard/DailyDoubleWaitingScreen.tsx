import "../../styles/PlayBoard/DailyDoubleWaitingScreen.css"


interface DailyDoubleModalProps {
    phase: string;
    activePlayer: string | null;

}


export default function DailyDoubleWaitingScreen({phase, activePlayer}: DailyDoubleModalProps) {
    return (
        <div className={`dd-splash ${phase === "waiting" ? "dd-splash--waiting" : ""}`}>
            <div className="dd-stars-row">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="dd-splash-star" style={{ animationDelay: `${i * 0.1}s` }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                ))}
            </div>

            <div className="dd-splash-title">Daily Double</div>

            <div className={`dd-waiting-line ${phase === "waiting" ? "dd-waiting-line--visible" : ""}`}>
                {activePlayer
                    ? <>Waiting for <span className="dd-player-name">{activePlayer}</span> to place their wager…</>
                    : <>Waiting for player to place their wager…</>
                }
            </div>

            <div className="dd-stars-row dd-stars-row--bottom">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="dd-splash-star" style={{ animationDelay: `${i * 0.12}s` }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                ))}
            </div>
        </div>
    )
}
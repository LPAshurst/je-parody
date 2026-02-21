import { useLocation, useNavigate } from "react-router-dom";
import type { Player, Game } from "../types";
import "../styles/EndGame.css";

interface EndGameState {
    game: Game;
    players: Record<string, Player>;
}

export default function EndGame() {
    const location = useLocation();
    const navigate = useNavigate();
    const { game, players } = location.state as EndGameState;

    const sorted = Object.entries(players).sort(([, a], [, b]) => b.score - a.score);

    const podiumOrder = [
        sorted[1], 
        sorted[0], 
        sorted[2], 
    ];

    const medals = ["🥈", "🥇", "🥉"];
    const podiumHeights = ["180px", "240px", "140px"];
    const podiumLabels = ["2ND", "1ST", "3RD"];
    const rankClasses = ["second", "first", "third"];

    return (
        <div className="endgame-wrapper">
            <div className="endgame-bg" />
            <div className="endgame-content">
                <div className="endgame-title">
                    <span className="endgame-title-main">FINAL SCORES</span>
                    <span className="endgame-title-sub">Room: {game.code}</span>
                </div>

                <div className="podium-container">
                    {podiumOrder.map((entry, i) => {
                        if (!entry) return <div key={i} className="podium-slot empty" />;
                        const [name, player] = entry;
                        return (
                            <div key={name} className={`podium-slot ${rankClasses[i]}`}>
                                <div className="podium-player-info">
                                    <span className="podium-medal">{medals[i]}</span>
                                    <span className="podium-name">{name}</span>
                                    <span className="podium-score">
                                        {player.score < 0 ? `-$${Math.abs(player.score).toLocaleString()}` : `$${player.score.toLocaleString()}`}
                                    </span>
                                </div>
                                <div
                                    className="podium-block"
                                    style={{ height: podiumHeights[i] }}
                                >
                                    <span className="podium-rank-label">{podiumLabels[i]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {sorted.length > 3 && (
                    <div className="leaderboard-rest">
                        <div className="leaderboard-rest-title">FULL STANDINGS</div>
                        {sorted.map(([name, player], i) => (
                            <div key={name} className="leaderboard-row">
                                <span className="leaderboard-rank">#{i + 1}</span>
                                <span className="leaderboard-name">{name}</span>
                                <span className="leaderboard-score">
                                    {player.score < 0 ? `-$${Math.abs(player.score).toLocaleString()}` : `$${player.score.toLocaleString()}`}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="endgame-home-btn" onClick={() => navigate("/")}>
                    PLAY AGAIN
                </button>
            </div>
        </div>
    );
}
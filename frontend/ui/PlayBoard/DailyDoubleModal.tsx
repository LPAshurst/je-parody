import { useState, useEffect } from "react";
import "../../styles/PlayBoard/ExpandingQuestionModal.css";
import type { PlayClue, Game } from "../../types";
import { useSocket } from "../../context/SocketContext";
import DailyDoubleWaitingScreen from "./DailyDoubleWaitingScreen";

interface DailyDoubleModalProps {
    onClose: () => void;
    clue: PlayClue;
    isAnswering: boolean;
    answerQuestion: (response: boolean) => void;
}

type Phase = "splash" | "waiting" | "question";

export default function DailyDoubleModal({ onClose, clue, isAnswering, answerQuestion }: DailyDoubleModalProps) {
    const [phase, setPhase] = useState<Phase>("splash");
    const [activePlayer, setActivePlayer] = useState<string | null>(null);
    const [wagerAmount, setWagerAmount] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { socket } = useSocket();

    const getFontSize = (text: string) => {
        const length = text.length;
        if (length > 300) return "clamp(1.5rem, 3vw, 3rem)";
        if (length > 200) return "clamp(2rem, 4vw, 4rem)";
        return "clamp(2.5rem, 5vw, 5rem)";
    };

    useEffect(() => {
        const t = setTimeout(() => setIsExpanded(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (phase !== "splash") return;
        const t = setTimeout(() => setPhase("waiting"), 2500);
        return () => clearTimeout(t);
    }, [phase]);

    useEffect(() => {
        socket.on("get-state", (game: Game) => {
            if (game.active_player) {
                setActivePlayer(game.active_player);
                const player = game.players[game.active_player];
                console.log(player)

                if (player?.wager && player.wager > 0 && phase === "waiting") {
                    setWagerAmount(player.wager);
                    setPhase("question");
                }
            }
        });
        return () => { socket.off("get-state"); };
    }, [phase]);

    // Keyboard handler for question phase
    useEffect(() => {
        if (phase !== "question") return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Backspace" && isAnswering) {
                setShowAnswer(true);
                answerQuestion(false);
            }
            if (e.key === "Enter" && !showAnswer) {
                setShowAnswer(true);
                answerQuestion(true);
            }

            if (e.key === "Escape" && showAnswer) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [phase, isAnswering, showAnswer]);

    return (
        <div className={`modal dd-modal ${isExpanded ? "expanded" : ""}`}>

            {/* ── Splash ───────────────────────────────── */}
            {(phase === "splash" || phase === "waiting") && (
                <DailyDoubleWaitingScreen phase={phase} activePlayer={activePlayer} />
            )}

            {/* ── Question ─────────────────────────────── */}
            {phase === "question" && (
                <>
                    <header className="expanding-modal-header">
                        <div className="option" style={{ flex: 1 }}>
                            Press <kbd>enter</kbd> if the answer is <span style={{ color: "green" }}>correct</span>
                        </div>
                        <div className="play-header-title">
                            {clue.category} — 
                            <span className="dd-header-wager"> ${wagerAmount?.toLocaleString()} </span>
                        </div>
                        <div className="option" style={{ flex: 1 }}>
                            Press <kbd>backspace</kbd> if the answer is <span style={{ color: "red" }}>wrong</span>
                        </div>
                    </header>
                    <div className="play-modal-content dd-question-content">
                        <div className="play-modal-clue" style={{ fontSize: getFontSize(clue.clue) }}>
                            {clue.clue}
                        </div>
                        <div
                            className="play-modal-response"
                            style={{ visibility: showAnswer ? "visible" : "hidden", fontSize: getFontSize(clue.clue) }}
                        >
                            {clue.response}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
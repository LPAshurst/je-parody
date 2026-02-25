import { useState, useEffect } from "react";
import "../../styles/PlayBoard/ExpandingQuestionModal.css";
import type { PlayClue, StateResponse } from "../../types";
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
        setPhase("waiting")
    }, [phase]);

    useEffect(() => {
        const onGameState = (response: StateResponse) => {
            if (response.game !== null) {
                const game = response.game;
                if (game.player_picking_category) {
                    setActivePlayer(game.player_picking_category);
                    const player = game.players[game.player_picking_category];
                    if (player.wager && player.wager > 0 && phase === "waiting") {
                        setWagerAmount(player.wager);
                        setPhase("question");
                    }
                }
            }

        };
        socket.on("get-state", onGameState);
        return () => { socket.off("get-state", onGameState); };
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

            {(phase === "splash" || phase === "waiting") && (
                <DailyDoubleWaitingScreen phase={phase} activePlayer={activePlayer} />
            )}

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
                        {clue.has_media ? (
                            <div
                                className="play-modal-clue"
                                dangerouslySetInnerHTML={{ __html: clue.clue }}
                            />
                        ) : (
                            <div className="play-modal-clue" style={{ fontSize: getFontSize(clue.clue) }}>
                                {clue.clue}
                            </div>
                        )}
                        <div className="play-modal-response" style={{"visibility": showAnswer ? "visible" : "hidden", fontSize: getFontSize(clue.clue)}}>
                            {clue.response}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
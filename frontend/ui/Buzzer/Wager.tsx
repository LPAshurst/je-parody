import { useState, useEffect } from "react";
import "../../styles/Buzzer/Wager.css";
import { Socket } from "socket.io-client";

interface WagerProps {
    room: string;
    userName: string;
    playerScore: number;
    onWagerSubmitted: () => void;
    socket: Socket;
}

const MIN_WAGER = 5;

export default function Wager({ room, userName, playerScore, onWagerSubmitted, socket }: WagerProps) {
    const maxWager = Math.max(playerScore, 1000); 
    const [wager, setWager] = useState(MIN_WAGER);
    const [inputValue, setInputValue] = useState(String(MIN_WAGER));
    const [inputError, setInputError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Keep input and slider in sync
    useEffect(() => {
        setInputValue(String(wager));
    }, [wager]);

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value);
        setWager(val);
        setInputError("");
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value);
        setInputError("");
    }

    function handleInputBlur() {
        const parsed = parseInt(inputValue, 10);
        if (isNaN(parsed)) {
            setInputError("Must be a number");
            setInputValue(String(wager));
            return;
        }
        if (parsed < MIN_WAGER) {
            setInputError(`Minimum wager is $${MIN_WAGER}`);
            setWager(MIN_WAGER);
            return;
        }
        if (parsed > maxWager) {
            setInputError(`Maximum wager is $${maxWager.toLocaleString()}`);
            setWager(maxWager);
            return;
        }
        setWager(parsed);
    }

    function handleSubmit() {
        if (submitted) return;
        console.log(wager)
        socket.emit("daily_double_wager", { room_id: room, user_name: userName, wager: wager });
        setSubmitted(true);
        onWagerSubmitted();
    }

    const sliderPercent = ((wager - MIN_WAGER) / (maxWager - MIN_WAGER)) * 100;

    return (
        <div className="wager-container">
            <div className="wager-card">
                <div className="wager-header">
                    <svg className="wager-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Daily Double</span>
                    <svg className="wager-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>

                <div className="wager-score-row">
                    <span className="wager-score-label">Your score</span>
                    <span className="wager-score-value">${playerScore.toLocaleString()}</span>
                </div>

                <div className="wager-amount-display">
                    ${wager.toLocaleString()}
                </div>

                {/* Slider */}
                <div className="wager-slider-wrapper">
                    <span className="wager-bound">${MIN_WAGER}</span>
                    <div className="wager-slider-track" style={{ "--thumb-percent": `${sliderPercent}%` } as React.CSSProperties}>
                        <div
                            className="wager-slider-fill"
                            style={{ width: `${sliderPercent}%` }}
                        />
                        <input
                            type="range"
                            min={MIN_WAGER}
                            max={maxWager}
                            step={5}
                            value={wager}
                            onChange={handleSliderChange}
                            className="wager-slider"
                        />
                    </div>
                    <span className="wager-bound">${maxWager.toLocaleString()}</span>
                </div>

                {/* Custom input */}
                <div className="wager-input-row">
                    <span className="wager-input-label">Custom amount</span>
                    <div className="wager-input-wrapper">
                        <span className="wager-input-prefix">$</span>
                        <input
                            type="number"
                            className={`wager-input ${inputError ? "error" : ""}`}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            min={MIN_WAGER}
                            max={maxWager}
                        />
                    </div>
                    {inputError && <span className="wager-error">{inputError}</span>}
                </div>

                <button
                    className="wager-submit"
                    onClick={handleSubmit}
                    disabled={submitted}
                >
                    {submitted ? "Wager Placed" : "Place Wager"}
                </button>
            </div>
        </div>
    );
}
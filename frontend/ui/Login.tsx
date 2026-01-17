import "../styles/Login.css"
import { X } from "lucide-react"
import { DarkTextField, LoginButton } from "../styles/muiStyled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";

interface LoginProps {
  modalType: "login" | "signup" | null;
  setModalType: (type: "login" | "signup" | null) => void;
}

export default function Login({modalType, setModalType}: LoginProps) {

    const [user, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch(`${import.meta.env.VITE_BACKEND_AUTH_API}/login`, {
            method: "POST",
            body: JSON.stringify({"username": user, "password": pass}),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })

        const data = await res.json();
        if (!res.ok) {
            setErrorMessage(data)
        } else {
            navigate("/home")
        }
    }

    function handleClose(modalType: LoginProps["modalType"]) {
        setModalType(modalType); 
        setUserName(""); 
        setPass(""); 
        setErrorMessage("");
    }


    const buttonDisabled = !(user.trim() !== "" && pass.trim() !== "");
    
    return (

        <Modal open={modalType === "login"} onClose={() => handleClose(null)}>
            <div className="login-container">
                <div className="login-header">
                    <button onClick={() => handleClose(null)} className="x-button">
                        <X color="#ffffff" strokeWidth={1.5} absoluteStrokeWidth />
                    </button>
                </div>
                <div className="login-content">
                    <h1>Log in</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <DarkTextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setUserName(e.target.value)}
                                inputProps={{ maxLength: 25 }}  // I know this is deprected and its stupid but whatever
                            />
                            <DarkTextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setPass(e.target.value)}
                                error={Boolean(errorMessage)}        
                                helperText={errorMessage || ""}
                                inputProps={{ minLength: 8, maxLength: 25 }}  // I know this is deprected and its stupid but whatever
                            />
                        </div>
                        <p style={{fontSize: ".815rem"}}>New to ConcertApp? <a style={{cursor: "pointer"}} onClick={() => handleClose("signup")}>Sign up</a></p>
                        <div className="login-footer">
                            <LoginButton disabled={buttonDisabled} type="submit">Log in</LoginButton>
                        </div>
                    </form>
                </div>

            </div>
        </Modal>

    )

}
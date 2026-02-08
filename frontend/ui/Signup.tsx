import "../styles/Login.css"
import { X } from "lucide-react"
import { DarkTextField, LoginButton } from "../styles/muiStyled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal  from "@mui/material/Modal";
import { UseAuth } from "../context/AuthContext";

interface SignupProps {
    modalType: "login" | "signup" | null;
    setModalType: (type: "login" | "signup" | null) => void;
}

export default function Signup({modalType, setModalType}: SignupProps) {

    const [user, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const auth = UseAuth();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        // const res = await fetch(`${import.meta.env.VITE_BACKEND_AUTH_API}/signup`, {
        //     method: "POST",
        //     body: JSON.stringify({"username": user, "password": pass}),
        //     credentials: "include",
        //     headers: { "Content-Type": "application/json" },
        // })

        const res = await fetch(`/api/user/signup`, {
            method: "POST",
            body: JSON.stringify({"username": user, "password": pass}),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
        
        const userData: string = await res.json();
        if (!res.ok) {
            setErrorMessage(userData)
        } else {
            auth.setUsername(userData);
            auth.setAuth(true)
            navigate("/home");
        }
    }

    function handleClose(modalType: SignupProps["modalType"]) {
        setModalType(modalType); 
        setUserName(""); 
        setPass(""); 
        setErrorMessage("");
    }

    const buttonDisabled = !(user.trim() !== "" && pass.trim() !== "");
    
    return (
        <Modal open={modalType === "signup"} onClose={() => handleClose(null)}>
            <div className="login-container">
                <div className="login-header">
                    <button onClick={() => handleClose(null)} className="x-button">
                        <X color="#ffffff" strokeWidth={1.5} absoluteStrokeWidth />
                    </button>
                </div>
                <div className="login-content">
                    <h1>Sign up</h1>
                    <form onSubmit={handleSignup}>
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
                        <p style={{fontSize: ".815rem"}}>Already have an account with us? <a style={{cursor: "pointer"}} onClick={() => handleClose("login")}>Log in</a></p>
                        <div className="login-footer">
                            <LoginButton disabled={buttonDisabled} type="submit">Sign up</LoginButton>
                        </div>
                    </form>
                </div>

            </div>
        </Modal>


    )

}
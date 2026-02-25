import { useState } from 'react';
import { UseAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Login from '../ui/Login';
import Signup from '../ui/Signup';
import "../styles/App.css"

export default function JeparodyApp() {
  const [modalType, setModalType] = useState<"login" | "signup" | null>(null);
  const { isAuthenticated } = UseAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="logo-area">
          <h1 className="logo-title">Je-parody</h1>
          <p className="logo-subtitle">trivia. your way.</p>
        </div>

        <div className="cta-section">
          <button
            onClick={() => setModalType("login")}
            className="cta-button primary"
          >
            Log In
          </button>
          
          <button
            onClick={() => setModalType("signup")}
            className="cta-button secondary"
          >
            Sign Up
          </button>
        </div>

        <p className="footer-text">
          Create custom boards. Host games. Challenge friends.
        </p>
      </div>

      <Login modalType={modalType} setModalType={setModalType} />
      <Signup modalType={modalType} setModalType={setModalType} />
    </div>
  );
}
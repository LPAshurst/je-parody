import { Navigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import React from "react";

type ProtectedRouteProps = {
  element: React.JSX.Element;
};

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = UseAuth();


  if (loading) {
    return <div>Checking authentication...</div>; // could also be a spinner
  }

  
  if (!isAuthenticated) {
    return element;
  } 

  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }
  return element;

}
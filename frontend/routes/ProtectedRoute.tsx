import { Navigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import React from "react";
import LoadingSpinner from "../ui/common/LoadingSpinner";

type ProtectedRouteProps = {
  element: React.JSX.Element;
};

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = UseAuth();


  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
}


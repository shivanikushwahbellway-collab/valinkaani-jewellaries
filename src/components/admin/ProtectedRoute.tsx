import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

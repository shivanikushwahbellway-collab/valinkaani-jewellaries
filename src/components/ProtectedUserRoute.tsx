import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "@/context/UserAuthContext";

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedUserRoute;




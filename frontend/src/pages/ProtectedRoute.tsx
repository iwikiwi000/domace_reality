import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();

  console.log("isAuthenticated:", user);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

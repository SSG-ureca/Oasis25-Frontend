import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? (
    <Navigate to="/main" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

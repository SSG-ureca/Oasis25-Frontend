import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { pathname, search } = useLocation();
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: pathname + search }}
      />
    );
  }

  return <Outlet />;
}

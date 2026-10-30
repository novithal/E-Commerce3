import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user } = useShop();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
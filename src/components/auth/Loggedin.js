import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Loggedin = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return Object.keys(auth).length > 1 ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default Loggedin;

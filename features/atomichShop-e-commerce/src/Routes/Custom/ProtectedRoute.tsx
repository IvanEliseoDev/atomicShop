import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/lib/AuthContext";

/** Solo accesible si el usuario está autenticado. Redirige a /login si no lo está. */
export const AuthenticatedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

/** Solo accesible si el usuario NO está autenticado. Redirige a / si ya tiene sesión. */
export const NotAuthenticatedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

import { type PropsWithChildren } from "react";
import { useAuthStore } from "../../auth/store/auth.store";
import { Navigate } from "react-router";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === "checking")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );

  if (authStatus === "not-authenticated") return <Navigate to="/login" />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === "checking")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );

  if (authStatus === "authenticated") return <Navigate to="/atomicAdmin/" />;

  return children;
};

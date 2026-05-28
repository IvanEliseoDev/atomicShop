import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ecommerceService } from "../services/ecommerceService";

interface AuthUser {
  id: string;
  name: string;
  mail: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (mail: string, password: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay sesion activa por cookie
  useEffect(() => {
    ecommerceService.getMe()
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (mail: string, password: string) => {
    const data = await ecommerceService.login(mail, password);
    if (data.status === "200") {
      // Volver a pedir los datos del usuario tras login exitoso
      const me = await ecommerceService.getMe();
      if (me.user) setUser(me.user);
      return { ok: true, message: data.message };
    }
    return { ok: false, message: data.message };
  };

  const logout = async () => {
    await ecommerceService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
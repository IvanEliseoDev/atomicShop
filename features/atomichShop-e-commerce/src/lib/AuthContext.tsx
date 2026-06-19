import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const BASE_URL = "http://localhost:4000/api/e-commerce";

interface AuthUser {
  id: string;
  name: string;
  mail: string;
  profilePic?: string;
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

  useEffect(() => {
    fetch(`${BASE_URL}/login/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const login = async (mail: string, password: string) => {
    const data = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mail, password }),
    }).then((r) => r.json());

    if (data.status === "200") {
      const me = await fetch(`${BASE_URL}/login/me`, {
        credentials: "include",
      }).then((r) => r.json());
      if (me.user) setUser(me.user);
      return { ok: true, message: data.message };
    }
    return { ok: false, message: data.message };
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
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
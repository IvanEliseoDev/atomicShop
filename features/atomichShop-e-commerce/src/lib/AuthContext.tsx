import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

const BASE_URL = `${import.meta.env.VITE_API_URL}/e-commerce`;

interface AuthUser {
    id: string;
    name: string;
    mail: string;
    profilePic?: string;
    direction?: string;
    deparmet?: string;
    municipality?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (mail: string, password: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkSession = async (isInitial = false) => {
    try {
      const r = await fetch(`${BASE_URL}/login/me`, { credentials: "include" });
      if (r.status === 403) {
        if (user || isInitial) {
          setUser(null);
          if (!isInitial) {
            toast.error("Tu cuenta ha sido restringida. Sesión cerrada.");
          }
        }
        return;
      }
      if (!r.ok) {
        if (isInitial) setUser(null);
        return;
      }
      const data = await r.json();
      if (data.user) setUser(data.user);
      else if (isInitial) setUser(null);
    } catch {
      if (isInitial) setUser(null);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    checkSession(true);
  }, []);

  // Verificación periódica de sesión (detecta restricción mientras está logueado)
  useEffect(() => {
    if (!user) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => checkSession(false), CHECK_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [user?.id]);

  // Verificar también cuando la ventana recupera el foco
  useEffect(() => {
    const onFocus = () => { if (user) checkSession(false); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [user?.id]);

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

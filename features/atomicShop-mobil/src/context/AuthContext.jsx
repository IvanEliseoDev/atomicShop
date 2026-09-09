import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../config/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "atomic-shop:auth-session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  const persistSession = useCallback(async (nextUser) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const clearSession = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => { if (raw) setUser(JSON.parse(raw)); })
      .catch(console.warn)
      .finally(() => setIsBooting(false));
  }, []);

  const login = useCallback(async ({ mail, password }) => {
    const normalizedMail = mail.trim().toLowerCase();

    const loginRes = await apiFetch("/api/e-commerce/login", {
      method: "POST",
      body: JSON.stringify({ mail: normalizedMail, password }),
    });
    const loginData = await loginRes.json().catch(() => ({}));
    if (!loginRes.ok) {
      const msg = loginData?.message ?? "Credenciales incorrectas";
      throw new Error(msg === "Email not found" ? "Correo no registrado" :
        msg === "Account blocked" ? "Cuenta bloqueada temporalmente. Intenta en 15 min." :
          msg === "Email not verified" ? "Debes verificar tu correo antes de iniciar sesión" :
            msg === "Account restricted" ? "Cuenta restringida. Contacta soporte." :
              "Credenciales incorrectas");
    }

    // Fetch profile to obtain _id (needed for cart API)
    let sessionUser = { mail: normalizedMail, name: "Cliente", _id: null };
    try {
      const meRes = await apiFetch("/api/e-commerce/login/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        const customer = meData?.user ?? meData;
        sessionUser = {
          _id: customer?.id ?? customer?._id ?? null,
          name: customer?.name ?? "Cliente",
          mail: normalizedMail,
        };
      }
    } catch (_) {
      // Continue with partial session — cart requires manual init
    }

    setUser(sessionUser);
    await persistSession(sessionUser);
    return sessionUser;
  }, [persistSession]);

  const register = useCallback(async (formData) => {
    const res = await apiFetch("/api/e-commerce/register", {
      method: "POST",
      body: JSON.stringify({ ...formData, mail: formData.mail.trim().toLowerCase() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.message ?? "";
      throw new Error(msg === "Customer already exists" ? "Este correo ya está registrado" :
        msg === "Email already registered as employee" ? "Este correo pertenece a un empleado" :
          "No se pudo completar el registro");
    }
    return data;
  }, []);

  const verifyRegistrationCode = useCallback(async ({ verificationCodeRequest }) => {
    const res = await apiFetch("/api/e-commerce/register/verifyCodeEmail", {
      method: "POST",
      body: JSON.stringify({ verificationCodeRequest }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "Código inválido o expirado");
    return data;
  }, []);

  const resendRegistrationCode = useCallback(async () => {
    const res = await apiFetch("/api/e-commerce/register/resendCode", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message ?? "No se pudo reenviar el código");
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await apiFetch("/api/e-commerce/logout", { method: "POST" }); } catch (_) { }
    setUser(null);
    await clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({
    user, isBooting, isAuthenticated: Boolean(user),
    login, register, verifyRegistrationCode, resendRegistrationCode, logout,
  }), [user, isBooting, login, register, verifyRegistrationCode, resendRegistrationCode, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

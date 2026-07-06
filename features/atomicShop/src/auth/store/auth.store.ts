import { create } from "zustand";
import { loginActions } from "../actions/login.action";
import { logOutAction } from "../actions/logOut.action";
import { CheckStatusAction } from "../actions/checkAuthStatus";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthState = {
  email: string | null;
  name: string | null;
  position: string | null;
  _id: string | null;
  authStatus: AuthStatus;
  restrictedMessage: string | null;

  isAdmin: boolean;
  isEmployee: () => boolean;

  login: (email: string, password: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
  logOut: () => void;
  clearRestrictedMessage: () => void;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  email: null,
  name: null,
  position: null,
  _id: null,
  authStatus: "checking",
  isAdmin: false,
  restrictedMessage: null,

  isEmployee: () => {
    const position = get().position;
    return position === "Employee";
  },

  login: async (email: string, password: string) => {
    try {
      const data = await loginActions(email, password);
      if (!data.data && data.status !== 200) return false;

      set({
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        position: data.data.position,
        authStatus: "authenticated",
        isAdmin: data.data.position === "Admin",
        restrictedMessage: null,
      });
      return true;
    } catch (error: any) {
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;
      const restricted = status === 403
        ? serverMessage || "Tu cuenta ha sido deshabilitada. Contacta al administrador."
        : null;
      set({
        email: null,
        name: null,
        position: null,
        authStatus: "not-authenticated",
        _id: null,
        isAdmin: false,
        restrictedMessage: restricted,
      });
      return false;
    }
  },

  logOut: async () => {
    try {
      await logOutAction();
    } catch (error) {
      console.log("No se pudo borrar la cookie en el servidor" + error);
    } finally {
      set({
        email: null,
        name: null,
        position: null,
        _id: null,
        authStatus: "not-authenticated",
        isAdmin: false,
        restrictedMessage: null,
      });
    }
  },

  clearRestrictedMessage: () => set({ restrictedMessage: null }),

  checkAuthStatus: async () => {
    try {
      set({ authStatus: "checking" });
      const data = await CheckStatusAction();

      if (!data) {
        set({
          email: null,
          name: null,
          position: null,
          _id: null,
          authStatus: "not-authenticated",
          isAdmin: false,
          restrictedMessage: null,
        });
        return false;
      }

      if ((data as any).isRestricted) {
        set({
          email: null,
          name: null,
          position: null,
          _id: null,
          authStatus: "not-authenticated",
          isAdmin: false,
          restrictedMessage: (data as any).message,
        });
        return false;
      }

      if (data.data?.email) {
        set({
          email: data.data.email,
          name: data.data.name,
          position: data.data.position,
          authStatus: "authenticated",
          _id: data.data._id,
          isAdmin: data.data.position === "Admin",
          restrictedMessage: null,
        });
        return true;
      }

      set({
        email: null,
        name: null,
        position: null,
        _id: null,
        authStatus: "not-authenticated",
        isAdmin: false,
      });
      return false;
    } catch (error) {
      console.error("Error inesperado en checkAuthStatus:", error);
      set({
        email: null,
        name: null,
        position: null,
        _id: null,
        authStatus: "not-authenticated",
        isAdmin: false,
      });
      return false;
    }
  },
}));
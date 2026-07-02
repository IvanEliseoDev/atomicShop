import { create } from "zustand";
import { loginActions } from "../actions/login.action";
import { logOutAction } from "../actions/logOut.action";
import { CheckStatusAction } from "../actions/checkAuthStatus";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthState = {
  email: string | null;
  position: string | null;
  _id: string | null;
  authStatus: AuthStatus;

  isAdmin: boolean;
  isEmployee: () => boolean;

  login: (email: string, password: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<boolean>;
  logOut: () => void;
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  email: null,
  position: null,
  _id: null,
  authStatus: "checking",
  isAdmin: false,

  isEmployee: () => {
    const position = get().position;
    return position === "Employee";
  },

  login: async (email: string, password: string) => {
    try {
      const data = await loginActions(email, password);
      if (!data.data && data.status !== 200) return false;
      
      set({
        email: data.data.email,
        position: data.data.position,
        authStatus: "authenticated",
        isAdmin: data.data.position === "Admin",
      });
      return true;
    } catch (error) {
      console.log(error);
      set({
        email: null,
        position: null,
        authStatus: "not-authenticated",
        _id: null,
        isAdmin: false,
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
        position: null,
        _id: null,
        authStatus: "not-authenticated",
        isAdmin: false,
      });
    }
  },

  checkAuthStatus: async () => {
    try {
      set({ authStatus: "checking" });
      const data = await CheckStatusAction();

      if (!data) {
        set({
          email: null,
          position: null,
          _id: null,
          authStatus: "not-authenticated",
          isAdmin: false,
        });
        return false;
      }

      if (data.data?.email) {
        set({
          email: data.data.email,
          position: data.data.position,
          authStatus: "authenticated",
          _id: data.data._id,
          isAdmin: data.data.position === "Admin",
        });
        return true;
      }

      set({
        email: null,
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
        position: null,
        _id: null,
        authStatus: "not-authenticated",
        isAdmin: false,
      });
      return false;
    }
  },
}));
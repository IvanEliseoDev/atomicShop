import { create } from 'zustand'
import { loginActions } from '../actions/login.action'
import { logOutAction } from '../actions/logOut.action'
import { CheckStatusAction } from '../actions/checkAuthStatus'

type AuthStatus = "authenticated" | "not-authenticated" | "checking"

type AuthState = {
    //propiedades
    email: string | null,
    position: string | null,
    _id: string | null
    authStatus: AuthStatus

    //getters
    isAdmin: () => boolean,
    isEmployee: () => boolean,

    //metodos
    login: (email: string, password: string) => Promise<boolean>
    checkAuthStatus: () => Promise<boolean>
    logOut: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    email: null,
    position: null,
    _id: null,
    authStatus: "not-authenticated",

    isAdmin: () => {
        const position = get().position
        console.log("Cargo del usuario", position)
        return position === "Admin"
    },

    isEmployee: () => {
        const position = get().position
        console.log("Cargo del usuario", position)
        return position === "Employee"
    },

    login: async (email: string, password: string) => {
        try {
            const data = await loginActions(email, password)
            if (!data.data && data.status !== 200) return false
            console.log("si vino data del login")
            console.log(data.data)
            set({ email: data.data.email, position: data.data.position, authStatus: "authenticated" })
            return true
        } catch (error) {
            console.log(error)
            set({email: null, position: null, authStatus: "not-authenticated" , _id: null})
            return false
        }
    },

    logOut: async() => {
        try{
            await logOutAction()
        }catch(error){
            console.log("No se pudo borrar la cookie en el servidor");
        }finally{
            set({
                email: null,
                position: null,
                _id: null,
                authStatus: 'not-authenticated'
            });
        }
    },

    checkAuthStatus: async() => {
        set({authStatus:"checking"})
        try {
            const data = await CheckStatusAction()
            set({email: data.data.email, position: data.data.position, authStatus: "authenticated", _id: data.data._id})
            return true
        } catch (error) {
            console.log(error)
            set({
                email: null,
                position: null,
                _id: null,
                authStatus: 'not-authenticated'
            });
            return false
        }
    }
}))


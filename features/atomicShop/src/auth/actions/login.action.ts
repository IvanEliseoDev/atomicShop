import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { LoginResponse } from "../interface/loginResponse"

export const loginActions = async (email: string, password: string) => {
    try {
        const { data } = await AtomicShop_API.post<LoginResponse>("/employees/login", { email: email, password: password })
        return data
    } catch (error) {
        console.log(error)
        throw error;
    }
} 
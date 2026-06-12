import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { CheckStatusResponse } from "../interface/check-status.response"

export const CheckStatusAction = async () => {
    try {
        const { data } = await AtomicShop_API.get<CheckStatusResponse>("/admin/employees/check-status");
        return data;
    } catch (error: any) {
        if (error?.response?.status === 401) {
            return null; // sin sesión, es esperado
        }
        console.log(error);
        throw error;
    }
};
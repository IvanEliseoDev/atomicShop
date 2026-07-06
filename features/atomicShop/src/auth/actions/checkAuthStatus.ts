import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { CheckStatusResponse } from "../interface/check-status.response"

export const CheckStatusAction = async () => {
    try {
        const { data } = await AtomicShop_API.get<CheckStatusResponse>("/admin/employees/check-status");
        return data;
    } catch (error: any) {
        if (error?.response?.status === 401) {
            return null;
        }
        if (error?.response?.status === 403) {
            const message = error?.response?.data?.message || "Tu cuenta ha sido deshabilitada. Contacta al administrador.";
            return { isRestricted: true, message } as any;
        }
        console.log(error);
        throw error;
    }
};
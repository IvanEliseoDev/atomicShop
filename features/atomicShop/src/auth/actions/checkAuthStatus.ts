import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { CheckStatusResponse } from "../interface/check-status.response"

export const CheckStatusAction = async () => {
    try {
        const { data } = await AtomicShop_API.get<CheckStatusResponse>("/employees/check-status")
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
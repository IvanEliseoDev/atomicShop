import { AtomicShop_API } from "@/api/AtomicShop-API"

export const logOutAction = async () => {
    try {
        const { data } = await AtomicShop_API.get("/employees/logout")
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
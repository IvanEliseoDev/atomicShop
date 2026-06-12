import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Provider } from "@/interfaces/provider.response"

export const getProviderAction = async():Promise<Provider[]> => {
    try {
        const { data } = await AtomicShop_API.get<Provider[]>("/admin/provider")

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al obtener marcas")
    }
}
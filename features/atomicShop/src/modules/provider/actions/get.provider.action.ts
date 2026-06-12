import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Providers } from "../interface/provider.response"

export const getProvider = async () => {
    try {
        
        const {data} = await AtomicShop_API.get<Providers>("/admin/provider")

        return data

    } catch (error) {

        console.log(error)
        throw new Error("Error al obtener proveedores")
    }
}
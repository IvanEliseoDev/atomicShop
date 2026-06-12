import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Brands } from "@/interfaces/brands.response"

export const getBrandsActions = async() => {
    try {
        const {data} = await AtomicShop_API.get<Brands[]>("/admin/brands")

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al obtener marcas")
    }
}
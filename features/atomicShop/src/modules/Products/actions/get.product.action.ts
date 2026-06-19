import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { ProductResponse } from "../interfaces/product.response"

export const getProductAction = async():Promise<ProductResponse> => {
    try {
        const {data} = await AtomicShop_API.get<ProductResponse>("/admin/products")
        return data
    } catch (error) {
        console.log(error)
        throw new Error("Error al hacer la peticion get de productos")
    }
}
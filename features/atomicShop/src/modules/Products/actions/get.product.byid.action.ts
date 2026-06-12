import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Product } from "../interfaces/product.byID.response"

export const getProductByIdAction = async(id:String):Promise<any> => {
    try {
        const {data} = await AtomicShop_API.get<Product>(`/admin/products/${id}`)

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al buscar producto por id")
    }
}
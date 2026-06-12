import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Category } from "@/interfaces/category.response"

export const getCategoriesAction = async() => {
    try {
        const {data} = await AtomicShop_API.get<Category[]>("/admin/brands")

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al obtener categorías")
    }
}

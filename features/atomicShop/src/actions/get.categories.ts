import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Category } from "@/interfaces/category.response"

export const getCategoriesAction = async() => {
    try {
        const {data} = await AtomicShop_API.get<{ data: Category[] }>("/admin/category")

        return data.data
    } catch (error) {
        console.log(error)
        throw new Error("error al obtener categorías")
    }
}

import { AtomicShop_API } from "@/api/AtomicShop-API"

export const deleteProduct = async(id:string) => {
    try {
        const {data} = await AtomicShop_API.delete(`/admin/products/${id}`)

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al eliminar el producto")
    }
}
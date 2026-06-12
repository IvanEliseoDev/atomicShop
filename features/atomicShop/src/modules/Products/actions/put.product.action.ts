import { AtomicShop_API } from "@/api/AtomicShop-API"

export const updateProduct = async(id:String, dataProduct:any) => {
    try {
        const {data} = await AtomicShop_API.put(`/admin/products/${id}`, dataProduct)

        return data
    } catch (error) {
        console.log(error)
        throw new Error("error al actualizar producto")
    }
}
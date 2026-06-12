import { AtomicShop_API } from "@/api/AtomicShop-API"

export const addProductAction = async({dataProduct}:any) => {
    try{
        const {data} = await AtomicShop_API.post("/admin/products", dataProduct)

        return data
    }catch(error){
        console.log(error)
        throw new Error("error al insertar producto")
    }
}
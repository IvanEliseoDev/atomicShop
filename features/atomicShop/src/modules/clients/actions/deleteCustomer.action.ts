import { AtomicShop_API } from "@/api/AtomicShop-API"

export const deleteCustomer = async(_id:String) => {
    try{
        const {data} = await AtomicShop_API.delete(`/admin/customers/${_id}`)
        return data
    }catch(error) {
        console.log(error)
        throw error
    }
}
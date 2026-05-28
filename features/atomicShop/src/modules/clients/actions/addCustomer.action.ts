import { AtomicShop_API } from "@/api/AtomicShop-API";
import type { CustomerEntity } from "../entity/customer.entity";

export const addCustomer = async(paylaod:CustomerEntity) => {
    try{
        const {data} = await AtomicShop_API.post('/customers', paylaod)
        return data
    }catch(error) {
        console.log(error)
        throw error
    }
}
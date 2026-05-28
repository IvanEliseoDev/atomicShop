import { AtomicShop_API } from "@/api/AtomicShop-API";
import type { CustomerEntity } from "../entity/customer.entity";

export const updateCustomer = async({ id, payload }: { id: string, payload: CustomerEntity }) => {
    try {
        const {data} =  await AtomicShop_API.put(`/customers/${id}`, payload)
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
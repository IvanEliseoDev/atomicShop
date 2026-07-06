import { AtomicShop_API } from "@/api/AtomicShop-API";
import type { CustomerEntity } from "../entity/customer.entity";

export const updateCustomer = async({ id, payload }: { id: string, payload: Partial<CustomerEntity> }) => {
    try {
        const {data} =  await AtomicShop_API.put(`/admin/customers/${id}`, payload)
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
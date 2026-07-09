import { AtomicShop_API } from "@/api/AtomicShop-API";

import type { CustomerByIDResponse } from "../responses/getCustomerByIDResponse";

export const getCustomerByID = async (id:string):Promise<CustomerByIDResponse> => {
    try {
        const { data } = await AtomicShop_API.get<CustomerByIDResponse>(`/admin/customers/${id}`)
        return data
    } catch (error) {
           console.log(error)
        throw error
    }

}
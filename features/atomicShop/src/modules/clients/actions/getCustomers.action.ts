import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { CustomerResponse } from "../responses/getCustomerResponse"

export const getCustomers = async ():Promise<CustomerResponse> => {
    try{
          const {data} = await AtomicShop_API.get<CustomerResponse>('/customers')
          console.log("data from axios ", data)
          return data
    }catch(error){
        console.log(error)
        throw error
    }
  
}
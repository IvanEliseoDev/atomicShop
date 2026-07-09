import { AtomicShop_API } from "@/api/AtomicShop-API"

export const addEmployeeAction = async(data:any) => {
    try {
        const {data:response} = await AtomicShop_API.post("/admin/employees", data)
        return response
    }
    catch (error) {
        console.log(error)
        throw new Error("error al agregar empleado")
    }
}
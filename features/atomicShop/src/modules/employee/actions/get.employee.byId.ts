import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Employee } from "../interfaces/employees.byid.response"

export const getEmployeeByIDAction = async (id: String) => {
    try {
        const { data } = await AtomicShop_API.get<Employee>(`/admin/employees/${id}`)
        return data
    }
    catch (error) {
        console.log(error)
        throw new Error("error al obtener empleado")
    }
}
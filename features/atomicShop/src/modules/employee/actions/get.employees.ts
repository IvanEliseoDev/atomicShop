import { AtomicShop_API } from "@/api/AtomicShop-API"
import type { Employees } from "../interfaces/employees.response"

export const getEmployeesAction = async() => {
    try {
        const {data} = await AtomicShop_API.get<Employees>("/admin/employees")
        return data
    }
    catch (error) {
        console.log(error)
        throw new Error("error al obtener empleados")
    }
}
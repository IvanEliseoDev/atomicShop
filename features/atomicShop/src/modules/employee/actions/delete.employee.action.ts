import { AtomicShop_API } from "@/api/AtomicShop-API"

export const deleteEmployeeAction = async(id:String) => {
    try {
        const {data} = await AtomicShop_API.delete(`/admin/employees/${id}`)
        return data
    }
    catch (error) {
        console.log(error)
        throw new Error("error al eliminar empleados")
    }
}
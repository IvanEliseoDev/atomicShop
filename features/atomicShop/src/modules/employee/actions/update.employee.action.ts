import { AtomicShop_API } from "@/api/AtomicShop-API"

export const updateEmployeeAction = async(id:String, dataUpd:any) => {
    try {
        const {data} = await AtomicShop_API.put(`/admin/employees/${id}`, dataUpd)
        return data
    }
    catch (error) {
        console.log(error)
        throw new Error("error al editar empleados")
    }
}
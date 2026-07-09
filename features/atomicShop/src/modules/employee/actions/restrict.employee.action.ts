import { AtomicShop_API } from "@/api/AtomicShop-API";

export const restrictEmployeeAction = async (id: string) => {
    try {
        const { data } = await AtomicShop_API.patch(`/admin/employees/${id}/toggle-status`);
        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Error al cambiar el estado del empleado");
    }
};

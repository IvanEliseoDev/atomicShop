import { AtomicShop_API } from "@/api/AtomicShop-API";

export const restrictCustomer = async ({ id, state }: { id: string; state: "restringido" | "comun" }) => {
    try {
        const { data } = await AtomicShop_API.put(`/admin/customers/${id}`, { state });
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

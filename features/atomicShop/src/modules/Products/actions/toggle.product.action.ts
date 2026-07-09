import { AtomicShop_API } from "@/api/AtomicShop-API";

export const toggleProductState = async (id: string) => {
    const { data } = await AtomicShop_API.patch(`/admin/products/${id}/toggle`);
    return data;
};

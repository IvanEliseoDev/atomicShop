import { AtomicShop_API } from "@/api/AtomicShop-API";

export const requestRecoveryCode = async (email: string) => {
    const { data } = await AtomicShop_API.post("/admin/recovery/requestCode", { email });
    return data;
};

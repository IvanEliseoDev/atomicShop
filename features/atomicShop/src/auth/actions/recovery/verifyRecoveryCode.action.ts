import { AtomicShop_API } from "@/api/AtomicShop-API";

export const verifyRecoveryCode = async (codeRequest: string) => {
    const { data } = await AtomicShop_API.post("/admin/recovery/verifyCode", { codeRequest });
    return data;
};

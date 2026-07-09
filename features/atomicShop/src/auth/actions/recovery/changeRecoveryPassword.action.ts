import { AtomicShop_API } from "@/api/AtomicShop-API";

export const changeRecoveryPassword = async (newPassword: string) => {
    const { data } = await AtomicShop_API.post("/admin/recovery/newPassword", {
        newPassword,
        confirmNewPassword: newPassword,
    });
    return data;
};

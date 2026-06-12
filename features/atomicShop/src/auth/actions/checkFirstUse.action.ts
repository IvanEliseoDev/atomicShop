import { AtomicShop_API } from "@/api/AtomicShop-API";

export const checkFirstUseAction = async (): Promise<boolean> => {
  try {
    const { data } = await AtomicShop_API.get("/admin/employees");

    const employees = data?.data ?? [];

    return employees.length === 0;
  } catch (error) {
    console.error("Error en checkFirstUseAction:", error);
    return true;
  }
};

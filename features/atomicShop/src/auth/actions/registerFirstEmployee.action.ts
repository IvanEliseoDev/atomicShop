import { AtomicShop_API } from "@/api/AtomicShop-API";

export interface FirstEmployeePayload {
  name: string;
  email: string;
  password: string;
  number_phone: string;
}

export const registerFirstEmployeeAction = async (
  payload: FirstEmployeePayload,
) => {
  try {
    const { data } = await AtomicShop_API.post("/admin/first-admin", payload);
    return { success: true, data, errors: [] };
  } catch (error: any) {
    console.error("Error en registerFirstEmployeeAction:", error);
    const responseData = error.response?.data;
    const errorMessage = responseData?.message || error.message || "Error desconocido";
    const validationErrors: { field: string; message: string }[] = responseData?.errors ?? [];
    console.error("Detalle:", errorMessage, validationErrors);
    return { success: false, data: null, error: errorMessage, errors: validationErrors };
  }
};

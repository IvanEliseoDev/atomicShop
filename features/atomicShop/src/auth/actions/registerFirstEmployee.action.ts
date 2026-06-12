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
    // La ruta correcta ahora será /api/admin/first-admin
    const { data } = await AtomicShop_API.post("/admin/first-admin", payload);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error en registerFirstEmployeeAction:", error);
    // Mejorar el mensaje de error para depuración
    const errorMessage =
      error.response?.data?.message || error.message || "Error desconocido";
    console.error("Detalle:", errorMessage);
    return { success: false, data: null, error: errorMessage };
  }
};

import { toast } from "sonner";
import {BASE_URL} from "../../../config/api" 

export function useRecoverNewPassword(onSuccess: () => void) {

  const updatePassword = async (password: string) => {

    try {

      const response = await fetch(
        `${BASE_URL}/recoveryPassword/newPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newPassword: password,
            confirmNewPassword: password,
          }),
        },
      );

      const result = await response.json();

      if (result.status === "200") {
        onSuccess();
      } else {
        toast.error("No fue posible actualizar la contraseña.");
      }

    } catch {
      toast.error("Error de conexión con el servidor.");
    }
  };

  return {
    updatePassword,
  };
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { ecommerceService } from "@/services/ecommerceService";
import { datosPagoSchema, type DatosPagoFormData } from "../schemas/datosPagoSchema";

export const formatCard = (value: string) =>
  value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

export const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

export function useDatosPago() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart, items, subtotal, discount } = useCart();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DatosPagoFormData>({
    resolver: zodResolver(datosPagoSchema),
    defaultValues: {
      metodo: "credito",
      numeroTarjeta: "",
      nombreTitular: "",
      vigencia: "",
      cvv: "",
    },
  });

  const metodo = watch("metodo");
  const numeroTarjeta = watch("numeroTarjeta");
  const nombreTitular = watch("nombreTitular");
  const vigencia = watch("vigencia");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("numeroTarjeta", formatCard(e.target.value), { shouldValidate: true });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("vigencia", formatExpiry(e.target.value), { shouldValidate: true });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("cvv", e.target.value.replace(/\D/g, "").slice(0, 4), { shouldValidate: true });
  };

  const onSubmit = async (data: DatosPagoFormData) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para finalizar la compra");
      navigate("/login");
      return;
    }

    const rawDelivery = sessionStorage.getItem("deliveryData");
    if (!rawDelivery) {
      toast.error("Faltan los datos de entrega");
      navigate("/carrito/datos-entrega");
      return;
    }

    setLoading(true);
    try {
      const deliveryData = JSON.parse(rawDelivery);
      let wompiTransactionId: string | null = null;

      if (data.metodo === "credito" || data.metodo === "debito") {
        const tokenResponse = await ecommerceService.getWompiToken();
        if (!tokenResponse?.access_token) {
          toast.error("No se pudo conectar con el procesador de pagos");
          return;
        }

        const wompiResponse = await ecommerceService.payWithWompi(
          tokenResponse.access_token,
          {
            monto: subtotal - discount,
            emailCliente: user.mail ?? "",
            nombreCliente: user.name ?? "",
            tokenTarjeta: data.numeroTarjeta.replace(/\s/g, ""),
            cvv: data.cvv,
            vigencia: data.vigencia,
            nombreTitular: data.nombreTitular,
            nombreProducto: "Compra en AtomicShop",
          },
        );

        if (!wompiResponse?.codigoAutorizacion && !wompiResponse?.id) {
          toast.error("El pago fue rechazado. Verifica los datos de tu tarjeta.");
          return;
        }

        wompiTransactionId = wompiResponse.codigoAutorizacion ?? wompiResponse.id;
      }

      const result = await ecommerceService.createInvoice({
        customerId: user.id,
        deliveryData,
        paymentMethod: data.metodo,
        wompiTransactionId,
        productos: items.map((item) => ({
          idProduct: String(item.id),
          qty: Number(item.quantity),
          unitPrice: Number(item.price),
        })),
      });

      if (result.status === "201" || result.ok) {
        sessionStorage.removeItem("deliveryData");
        clearCart();
        toast.success("¡Compra finalizada! Revisa tu correo para ver tu factura.");
        navigate("/");
      } else {
        toast.error(result.message ?? "Ocurrió un error al procesar la compra");
      }
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    metodo,
    numeroTarjeta,
    nombreTitular,
    vigencia,
    loading,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvvChange,
    setValue,
    navigate,
  };
}

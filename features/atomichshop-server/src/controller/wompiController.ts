import { Request, Response } from "express";
import fetch from "node-fetch";
import { config } from "../config";

export const wompiController = {
  generarToken: async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await fetch("https://id.wompi.sv/connect/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: config.wompi.grant_type as string,
          audience: config.wompi.audience as string,
          client_id: config.wompi.client_id as string,
          client_secret: config.wompi.client_secret as string,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return res
          .status(502)
          .json({ message: "Error al obtener token de Wompi", error });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("wompiController.generarToken:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  realizarPago: async (req: Request, res: Response): Promise<any> => {
    try {
      const { bearerToken, formData } = req.body;

      console.log("formData recibido:", formData); // Para debug

      const [mes, anioCorto] = (formData.vigencia as string).split("/");
      const anio = `20${anioCorto}`; // "88" → "2088"

      const wompiBody = {
        emailCliente: formData.emailCliente,
        nombreCliente: formData.nombreCliente,
        tokenTarjeta: formData.tokenTarjeta.replace(/\s/g, ""),
        cvv: formData.cvv,
        mes: mes,
        anio: anio,
        monto: formData.monto,
        nombreProducto: formData.nombreProducto ?? "Compra en AtomicShop",
      };

      console.log("Body enviado a Wompi:", wompiBody); // Para debug

      const response = await fetch(
        "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(wompiBody),
        },
      );

      const data = (await response.json()) as any;

      if (!response.ok) {
        console.error("Wompi rechazó el pago:", data);
        return res
          .status(502)
          .json({ message: "Pago rechazado por Wompi", error: data });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("wompiController.realizarPago:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

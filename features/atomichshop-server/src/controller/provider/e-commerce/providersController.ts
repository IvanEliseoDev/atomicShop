import { Request, Response } from "express";
import providersModel from "../../../models/providers";

export const providersEcommerceController = {
  // Obtener proveedores activos para la seccion "Nuestros proveedores" de la home
  getHomeProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const providers = await providersModel.find({}, { name: 1, imgProvider: 1 });
      res.status(200).json(providers);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener proveedores", error: err.message });
    }
  }
};
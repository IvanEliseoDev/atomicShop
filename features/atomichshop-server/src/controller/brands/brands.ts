import { Request, Response } from "express";
import { modelBrands } from "../../models/brands";

export const brandsController = {
  // Obtener las marcas para llenar el submenu de marcas que esta debajo del navbar en el ecommerce
  getBrands: async (req: Request, res: Response): Promise<void> => {
    try {
      const brands = await modelBrands.find()

      if (!brands) {
        res.status(404).json({ message: "No hay marcas disponibles" });
        return;
      }

      res.status(200).json(brands);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener marcas", error: err.message });
    }
  }
};
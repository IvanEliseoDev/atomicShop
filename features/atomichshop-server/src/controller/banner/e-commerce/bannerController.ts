import { Request, Response } from "express";
import { modelBanner } from "../../../models/banner";

export const bannerController = {
  // Obtener banners activos para el carrusel de inicio
  getHomeBanners: async (req: Request, res: Response): Promise<void> => {
    try {
      const banners = await modelBanner.find({ state: true });
      res.status(200).json(banners);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener banners", error: err.message });
    }
  }
};
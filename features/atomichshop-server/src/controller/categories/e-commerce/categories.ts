import { Request, Response } from "express";
import { categoryModel  } from "../../../models/categories";

export const categoriesEcommerceController = {
  // Obtener las categorias para llenar el submenu de categorias que esta debajo del navbar en el ecommerce
  getCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await categoryModel .find()

      if (!categories) {
        res.status(404).json({ message: "No hay categorias disponibles" });
        return;
      }

      res.status(200).json(categories);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener categorias", error: err.message });
    }
  }
};
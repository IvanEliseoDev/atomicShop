// ruta: ../src/controller/productsController.ts

// Importo el esquema de la coleccion que voy a ocupar
import productsModel from "../models/products.js";

// Esto es
import { Request, Response } from "express";

// Creo un array de products y alparecer no se pueda hacer como hantes, si no que en el array que creamos, adentro se ponen los metodos
const productsController = {
  // INSERT MASIVO
  insertManyProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const products = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        res.status(400).json({
          message: "Se requiere un array con al menos un elemento",
        });
        return;
      }

      const result = await productsModel.insertMany(products);
      res.status(201).json({
        message: `${result.length} productos creados exitosamente`,
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: "Error al insertar productos",
        error: err.message,
      });
    }
  },

  // GET ALL
  getProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await productsModel.find();
      res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al obtener productos", error: err.message });
    }
  },

  // INSERT ONE
  insertProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const product = new productsModel(req.body);
      const result = await product.save();
      res
        .status(201)
        .json({ message: "Producto creado exitosamente", data: result });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al crear producto", error: err.message });
    }
  },

  // UPDATE
  updateProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await productsModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Producto actualizado", data: result });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al actualizar producto", error: err.message });
    }
  },

  // DELETE
  deleteProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await productsModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al eliminar producto", error: err.message });
    }
  },
};

export default productsController;

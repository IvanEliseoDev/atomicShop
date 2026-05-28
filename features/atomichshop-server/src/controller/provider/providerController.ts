// ruta: ../src/controller/providersController.ts

// Importo el esquema de la coleccion que voy a ocupar
import providersModel from "../../models/providers";

// Esto es
import { Request, Response } from "express";

// Creo un array de providers y alparecer no se pueda hacer como hantes, si no que en el array que creamos, adentro se ponen los metodos
const providersController = {
  // INSERT MASIVO
  insertManyProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const providers = req.body;

      if (!Array.isArray(providers) || providers.length === 0) {
        res.status(400).json({
          message: "Se requiere un array con al menos un elemento",
        });
        return;
      }

      const result = await providersModel.insertMany(providers);
      res.status(201).json({
        message: `${result.length} proveedores creados exitosamente`,
        data: result,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        message: "Error al insertar proveedores",
        error: err.message,
      });
    }
  },

  // GET ALL
  getProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const providers = await providersModel.find();
      res.status(200).json(providers);
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al obtener proveedor", error: err.message });
    }
  },

  // INSERT ONE
  insertProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const product = new providersModel(req.body);
      const result = await product.save();
      res
        .status(201)
        .json({ message: "Proveedor creado exitosamente", data: result });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al crear provedor", error: err.message });
    }
  },

  // UPDATE
  updateProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await providersModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({ message: "Proveedor actualizado", data: result });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al actualizar provedor", error: err.message });
    }
  },

  // DELETE
  deleteProviders: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await providersModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Proveedor eliminado exitosamente" });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al eliminar provedor", error: err.message });
    }
  },
};

export default providersController;

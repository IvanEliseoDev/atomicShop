import { Request, Response } from "express";
import { categoryModel } from "../../models/categories"

export const categoryController = {

    getCategories: async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await categoryModel.find();
            
            if (!categories || categories.length === 0) {
                res.status(404).json({ status: 404, message: "Categorías no encontradas", data: null });
                return; // Evita que continúe al estado 200
            }
            
            res.status(200).json({ status: 200, message: "Categorías encontradas exitosamente", data: categories });
        } catch (error) {
            console.error("Error interno del servidor", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor - revisar logs" });
        }
    },

    // OBTENER UNA CATEGORÍA POR ID
    getCategoryById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await categoryModel.findById(id);

            if (!category) {
                res.status(404).json({ status: 404, message: "Categoría no encontrada", data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Categoría encontrada exitosamente", data: category });
        } catch (error) {
            console.error("Error al obtener la categoría", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor" });
        }
    },

    // CREAR UNA NUEVA CATEGORÍA
    createCategory: async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, state } = req.body;

            // Validación básica opcional
            if (!name || !state) {
                res.status(400).json({ status: 400, message: "El nombre y el estado son requeridos" });
                return;
            }

            const newCategory = new categoryModel({ name, state });
            await newCategory.save();

            res.status(201).json({ status: 201, message: "Categoría creada exitosamente", data: newCategory });
        } catch (error) {
            console.error("Error al crear la categoría", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor" });
        }
    },

    // ACTUALIZAR UNA CATEGORÍA EXISTENTE
    updateCategory: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, state } = req.body;

            // { new: true } sirve para que retorne el documento ya actualizado y no el viejo
            const updatedCategory = await categoryModel.findByIdAndUpdate(
                id, 
                { name, state }, 
                { new: true, runValidators: true }
            );

            if (!updatedCategory) {
                res.status(404).json({ status: 404, message: "Categoría no encontrada para actualizar", data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Categoría actualizada exitosamente", data: updatedCategory });
        } catch (error) {
            console.error("Error al actualizar la categoría", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor" });
        }
    },

    // ELIMINAR UNA CATEGORÍA
    deleteCategory: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const deletedCategory = await categoryModel.findByIdAndDelete(id);

            if (!deletedCategory) {
                res.status(404).json({ status: 404, message: "Categoría no encontrada para eliminar", data: null });
                return;
            }

            res.status(200).json({ status: 200, message: "Categoría eliminada exitosamente", data: deletedCategory });
        } catch (error) {
            console.error("Error al eliminar la categoría", error);
            res.status(500).json({ status: 500, message: "Error interno del servidor" });
        }
    }
}
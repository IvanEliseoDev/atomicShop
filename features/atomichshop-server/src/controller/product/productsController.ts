import { Request, Response } from "express";
import { modelProducts } from "../../models/product";
import { invoiceModel } from "../../models/invoice";
import { modelCarts } from "../../models/cart";

// Creo un array de products y alparecer no se pueda hacer como hantes, si no que en el array que creamos, adentro se ponen los metodos
export const productsController = {
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

      const result = await modelProducts.insertMany(products);
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
      const products = await modelProducts.find()
        .populate('brandId', 'name')
        .populate('categoryId', 'name');
      if (!products) res.status(404).json({status: 404, message:"Productos no encontrados", data: null})
      res.status(200).json({status:200, message:"Productos encontrados exitosamente", data:products});
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({status:500, message: "Error al obtener productos", error: err.message });
    }
  },

  getProductById: async(req:Request, res:Response) => {
    try {
      const product = await modelProducts.findById(req.params.id)
        .populate('brandId', 'name')
        .populate('categoryId', 'name');
      if (!product) res.status(404).json({status: 404, message:"Producto no encontrados", data: null})
      res.status(200).json({status:200, message:"Producto encontrado exitosamente", data:product});
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({status:500, message: "Error al obtener el producto", error: err.message });
    }
  },

  // INSERT ONE
  insertProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { providerId, ...productData } = req.body;

      const files = req.files as Express.Multer.File[];
      const imageUrls = files ? files.map((f) => f.path) : [];

      const product = new modelProducts({ ...productData, images: imageUrls });
      const result = await product.save();
      res.status(201).json({ status: 201, message: "Producto creado exitosamente", data: result });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al crear producto", error: err.message });
    }
  },

  // UPDATE
  updateProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { providerId, imagenesEliminadas: eliminadasRaw, ...productData } = req.body;

      const files = req.files as Express.Multer.File[];
      const newImageUrls = files ? files.map((f) => f.path) : [];

      const imagenesEliminadas: string[] = eliminadasRaw
        ? JSON.parse(eliminadasRaw)
        : [];

      const existing = await modelProducts.findById(id);
      const existingImages: string[] = (existing?.images as string[]) ?? [];

      const mergedImages = [
        ...existingImages.filter((url) => !imagenesEliminadas.includes(url)),
        ...newImageUrls,
      ];

      const result = await modelProducts.findByIdAndUpdate(
        id,
        { ...productData, images: mergedImages },
        { new: true }
      );
      res.status(200).json({ message: "Producto actualizado", data: result });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al actualizar producto", error: err.message });
    }
  },

  // TOGGLE STATE
  toggleProductState: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await modelProducts.findById(id);
      if (!product) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }
      product.state = !product.state;
      await product.save();
      res.status(200).json({ message: "Estado actualizado", data: product });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al cambiar estado", error: err.message });
    }
  },

  // DELETE
  deleteProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const usedInInvoice = await invoiceModel.findOne({ "products.productId": id });
      if (usedInInvoice) {
        res.status(409).json({ message: "No se puede eliminar: el producto ya está registrado en una o más facturas." });
        return;
      }

      const usedInCart = await modelCarts.findOne({ "products.idProduct": id });
      if (usedInCart) {
        res.status(409).json({ message: "No se puede eliminar: el producto está en el carrito de un cliente." });
        return;
      }

      await modelProducts.findByIdAndDelete(id);
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      const err = error as Error;
      res
        .status(500)
        .json({ message: "Error al eliminar producto", error: err.message });
    }
  },
};

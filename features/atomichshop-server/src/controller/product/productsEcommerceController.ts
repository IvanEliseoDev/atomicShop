import { Request, Response } from "express";
import { modelProducts } from "../../models/products";

export const productsEcommerceController = {
  // Obtener productos para carrusel en la pagina de inicio (Limite de 10)
  getHomeCarousel: async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await modelProducts.find({ state: true }).limit(10);
      res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener carrusel", error: err.message });
    }
  },

  // Buscador dinamico (Regex) para barra de busqueda y resultados
  searchProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;
      const searchRegex = new RegExp(String(q), "i"); // "i" para que no importe mayusculas/minusculas
      
      const products = await modelProducts.find({
        state: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      }).limit(20);

      res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error en la busqueda", error: err.message });
    }
  },

  // Obtener productos con filtros (Precio, Marca, Relevancia)
  getProductsShop: async (req: Request, res: Response): Promise<void> => {
    try {
      const { minPrice, maxPrice, brandId, sort } = req.query;
      let query: any = { state: true };

      // Filtro por rango de precio
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // Filtro por marca
      if (brandId) {
        query.brandId = brandId;
      }

      // Orden de relevancia / precio
      let sortOptions: any = {};
      if (sort === "price_asc") sortOptions.price = 1;
      else if (sort === "price_desc") sortOptions.price = -1;
      else sortOptions.createdAt = -1; // Mas recientes como relevancia por defecto

      const products = await modelProducts.find(query)
        .populate("brandId") // Para mostrar nombre de marca en lugar de solo ID
        .sort(sortOptions);

      res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al filtrar productos", error: err.message });
    }
  },

  // Detalle de producto por ID
  getProductById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await modelProducts.findById(id).populate("brandId categoryId");
      
      if (!product) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener detalle", error: err.message });
    }
  },

  // Productos similares (Misma categoria, excluyendo el actual)
  getSimilarProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId, currentId } = req.query;
      const products = await modelProducts.find({
        categoryId,
        _id: { $ne: currentId }, // Excluir el producto que ya se esta viendo
        state: true
      }).limit(4);

      res.status(200).json(products);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener similares", error: err.message });
    }
  }
};
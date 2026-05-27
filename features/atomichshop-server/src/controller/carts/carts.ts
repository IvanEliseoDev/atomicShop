import { Request, Response } from "express";
import { modelCarts } from "../../models/cart";

export const cartEcommerceController = {
  // Obtener carrito con productos poblados por clientId (para sidebar y pagina de carrito)
  getCartByClient: async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId } = req.params;
      const cart = await modelCarts
        .findOne({ clientId })
        .populate("products.idProduct", "name price discount images");

      if (!cart) {
        res.status(404).json({ message: "Carrito no encontrado" });
        return;
      }

      res.status(200).json(cart);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al obtener carrito", error: err.message });
    }
  },

  // Agregar producto al carrito. Si el carrito no existe lo crea, si el producto ya existe suma cantidad
  addOrUpdateCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId, idProduct, amount } = req.body;

      let cart = await modelCarts.findOne({ clientId });

      if (!cart) {
        // Crear carrito nuevo con el primer producto
        cart = new modelCarts({
          clientId,
          products: [{ idProduct, amount }],
          total: 0,
          disccount: 0,
          totalWithDiscount: 0
        });
      } else {
        // Verificar si el producto ya existe en el carrito
        const existingProduct = cart.products.find(
          (p) => p.idProduct.toString() === idProduct
        );

        if (existingProduct) {
          existingProduct.amount += amount; // Sumar cantidad si ya existe
        } else {
          cart.products.push({ idProduct, amount }); // Agregar si es nuevo
        }
      }

      await cart.save();

      // Retornar carrito poblado para que el frontend lo use directamente
      const populated = await modelCarts
        .findById(cart._id)
        .populate("products.idProduct", "name price discount images");

      res.status(200).json(populated);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al actualizar carrito", error: err.message });
    }
  },

  // Eliminar un producto especifico del carrito
  removeProductFromCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const { clientId, idProduct } = req.body;

      const cart = await modelCarts.findOne({ clientId });

      if (!cart) {
        res.status(404).json({ message: "Carrito no encontrado" });
        return;
      }

      cart.products = cart.products.filter(
        (p) => p.idProduct.toString() !== idProduct
      );

      await cart.save();
      res.status(200).json({ message: "Producto eliminado del carrito", data: cart });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error al eliminar producto", error: err.message });
    }
  }
};
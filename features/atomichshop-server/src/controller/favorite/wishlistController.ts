import { Request, Response } from "express";
import { customerModel } from "../../models/customer";
import { modelProducts } from "../../models/product";

const asId = (value: unknown): string => String(value ?? "");

export const wishlistController = {

    // GET /:customerId  — lista de favoritos del cliente (productos completos)
    getWishlist: async (req: Request, res: Response): Promise<any> => {
        try {
            const { customerId } = req.params;
            const customer = await customerModel.findById(customerId).select("wishlist");

            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer not found" });
            }

            const ids = (customer.wishlist || []).map(asId).filter(Boolean);
            const products = ids.length
                ? await modelProducts.find({ _id: { $in: ids } })
                : [];

            return res.status(200).json({ status: "200", data: products });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error" });
        }
    },

    // POST /add  — { customerId, productId }
    addToWishlist: async (req: Request, res: Response): Promise<any> => {
        try {
            const customerId = asId(req.body?.customerId);
            const productId = asId(req.body?.productId);

            if (!customerId || !productId) {
                return res.status(400).json({ status: "400", message: "customerId and productId are required" });
            }

            const customer = await customerModel.findById(customerId);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer not found" });
            }

            const product = await modelProducts.findById(productId);
            if (!product) {
                return res.status(404).json({ status: "404", message: "Product not found" });
            }

            if (!customer.wishlist) customer.wishlist = [];
            const already = customer.wishlist.some((id) => asId(id) === productId);
            if (already) {
                return res.status(200).json({ status: "200", message: "Already in wishlist", data: customer.wishlist });
            }

            customer.wishlist.push(productId);
            await customer.save();

            return res.status(200).json({ status: "200", message: "Added to wishlist", data: customer.wishlist });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error" });
        }
    },

    // DELETE /remove  — { customerId, productId }
    removeFromWishlist: async (req: Request, res: Response): Promise<any> => {
        try {
            const customerId = asId(req.body?.customerId);
            const productId = asId(req.body?.productId);

            if (!customerId || !productId) {
                return res.status(400).json({ status: "400", message: "customerId and productId are required" });
            }

            const customer = await customerModel.findById(customerId);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer not found" });
            }

            customer.wishlist = (customer.wishlist || []).filter((id) => asId(id) !== productId);
            await customer.save();

            return res.status(200).json({ status: "200", message: "Removed from wishlist", data: customer.wishlist });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error" });
        }
    }
};

export const addFavorite = wishlistController.addToWishlist;
export const removeFavorite = wishlistController.removeFromWishlist;
export const getMyFavorites = wishlistController.getWishlist;
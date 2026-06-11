import { Request, Response } from "express";
import { customerModel } from "../../models/customer";

export const wishlistController = {

    // GET 
    getWishlist: async (req: Request, res: Response): Promise<any> => {
    try {
        const { customerId } = req.params;
        const customer = await customerModel.findById(customerId).select("wishlist");

        if (!customer) {
            return res.status(404).json({ status: "404", message: "Customer not found" });
        }

        // ← Busca los productos manualmente por sus IDs
        const { modelProducts } = await import("../../models/product");
        const products = await modelProducts.find({ 
            _id: { $in: customer.wishlist } 
        });

        return res.status(200).json({ status: "200", data: products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "500", message: "Internal Server Error" });
    }
},

    // POST 
    addToWishlist: async (req: Request, res: Response): Promise<any> => {
        try {
            const { customerId, productId } = req.body;

            const customer = await customerModel.findById(customerId);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer not found" });
            }

            // Evitar duplicados
            if (!customer.wishlist) customer.wishlist = [];
            if (customer.wishlist.includes(productId)) {
                return res.status(200).json({ status: "200", message: "Already in wishlist" });
            }

            customer.wishlist.push(productId);
            await customer.save();

            return res.status(200).json({ status: "200", message: "Added to wishlist", data: customer.wishlist });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error" });
        }
    },

    // DELETE 
    removeFromWishlist: async (req: Request, res: Response): Promise<any> => {
        try {
            const { customerId, productId } = req.body;

            const customer = await customerModel.findById(customerId);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer not found" });
            }

            customer.wishlist = (customer.wishlist || []).filter(id => id !== productId);
            await customer.save();

            return res.status(200).json({ status: "200", message: "Removed from wishlist", data: customer.wishlist });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error" });
        }
    }
};
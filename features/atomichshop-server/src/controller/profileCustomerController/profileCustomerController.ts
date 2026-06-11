import { Request, Response } from 'express';
import { customerModel } from '../../models/customer'; 
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_key,
  api_secret: config.cloudinary.cloudinary_secret,
});

export const profileCustomerController = {
    // 1. Obtener los datos del perfil actual del cliente
    getProfileData: async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params; 

            if (!id) {
                return res.status(400).json({ status: 400, message: "Customer ID is required" });
            }

            const customer = await customerModel.findById(id).select("-password -loginAttemps -timeOut");
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer Not Found" });
            }

            return res.status(200).json({ 
                status: '200', 
                message: "Profile data fetched successfully", 
                data: customer 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" });
        }
    },

    // 2. Actualizar datos personales y cargar imagen
    updateProfileData: async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params;
            const { telephone, direction, dui, name } = req.body;

            if (!id) {
                return res.status(400).json({ status: 400, message: "Customer ID is required" });
            }

            const customer = await customerModel.findById(id);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer Not Found" });
            }

            if (name) customer.name = name;
            if (telephone) customer.telephone = telephone;
            if (direction) customer.direction = direction;
            if (dui) customer.dui = dui;

            if (req.file) {
                if (customer.public_id) {
                    await cloudinary.uploader.destroy(customer.public_id);
                }
                const file = req.file as any;
                customer.image = file.path;      
                customer.public_id = file.filename; 
            }

            const updatedCustomer = await customer.save();

            return res.status(200).json({
                status: 200,
                message: "Profile updated successfully",
                data: {
                    name: updatedCustomer.name,
                    mail: updatedCustomer.mail,
                    telephone: updatedCustomer.telephone,
                    direction: updatedCustomer.direction,
                    dui: updatedCustomer.dui,
                    image: updatedCustomer.image
                }
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" });
        }
    },

    // 3. Registrar una nueva compra en el historial del cliente
    addPurchase: async (req: Request, res: Response): Promise<any> => {
        try {
            const { id } = req.params; 
            const { total, descuento, productos } = req.body;

            if (!id) {
                return res.status(400).json({ status: 400, message: "Customer ID is required" });
            }

            const customer = await customerModel.findById(id);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer Not Found" });
            }

            const nuevaCompra = {
                id: `FAC-${Math.floor(100000 + Math.random() * 900000)}`, 
                date: new Date().toLocaleDateString('es-ES'), 
                discount: descuento || "0%",
                total: total,
                productos: productos 
            };

            if (!customer.purchases) {
                customer.purchases = [];
            }
            
            customer.purchases.unshift(nuevaCompra);
            await customer.save();

            return res.status(201).json({
                status: 201,
                message: "Purchase registered successfully",
                data: nuevaCompra
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Error saving purchase to database" });
        }
    },

    // 4. Eliminar una compra del historial de MongoDB
    deletePurchase: async (req: Request, res: Response): Promise<any> => {
        try {
            const { id, purchaseId } = req.params; // id = cliente, purchaseId = código factura (FAC-XXXXXX)

            if (!id || !purchaseId) {
                return res.status(400).json({ status: 400, message: "Customer ID and Purchase ID are required" });
            }

            // Buscamos al cliente y removemos del array de purchases el objeto cuyo id coincida con purchaseId
            const customer = await customerModel.findByIdAndUpdate(
                id,
                { $pull: { purchases: { id: purchaseId } } },
                { new: true } // Nos devuelve el documento actualizado
            );

            if (!customer) {
                return res.status(404).json({ status: 404, message: "Customer Not Found" });
            }

            return res.status(200).json({
                status: 200,
                message: "Purchase deleted successfully from database",
                data: customer.purchases
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "500", message: "Error deleting purchase from database" });
        }
    }
};
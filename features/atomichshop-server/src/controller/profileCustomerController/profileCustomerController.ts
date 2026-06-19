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

            return res.status(200).json({ status: '200', message: "Profile data fetched successfully", data: customer });
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

            // Buscamos al cliente actual
            const customer = await customerModel.findById(id);
            if (!customer) {
                return res.status(404).json({ status: "404", message: "Customer Not Found" });
            }

            // Actualizamos solo los campos que se permite editar en "Administrar Perfil"
            if (name) customer.name = name;
            if (telephone) customer.telephone = telephone;
            if (direction) customer.direction = direction;
            if (dui) customer.dui = dui;

            // Manejo de la Imagen de Perfil
            if (req.file) {
                // Borrar imagen anterior si existe
                if (customer.public_id) {
                    await cloudinary.uploader.destroy(customer.public_id);
                }
                const file = req.file as any;
                customer.image = file.path;       // URL de Cloudinary
                customer.public_id = file.filename; // public_id de Cloudinary
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
    }
};
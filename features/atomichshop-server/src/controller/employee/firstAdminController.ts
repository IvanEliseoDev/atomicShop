
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { employeeModel } from "../../models/employee";

export const firstAdminController = {
    registerFirstAdmin: async (req: Request, res: Response) => {
        try {
            // Seguridad: verificar que de verdad no existe ningún empleado
            const count = await employeeModel.countDocuments();
            if (count > 0) {
                return res.status(403).json({
                    status: 403,
                    message: "Ya existe al menos un empleado registrado. Esta ruta es solo de primer uso."
                });
            }

            const { name, email, password, number_phone } = req.body;

            const existEmployee = await employeeModel.findOne({ email });
            if (existEmployee) {
                return res.status(409).json({
                    status: 409,
                    message: "Ya existe un empleado con ese correo.",
                    data: null
                });
            }

            const passwordHashed = await bcrypt.hash(password, 10);

            const newAdmin = new employeeModel({
                name,
                email,
                number_phone: number_phone ?? "",
                password: passwordHashed,
                position: "Admin",
                // Campos requeridos por el schema con valores neutros
                dui: "00000000-0",
                birthDay: new Date(),
                payroll_month: "N/A",
                salary: 0,
                isGenericPassword: false, // El admin define su propia contraseña
                isVerified: true,         // No necesita verificación por correo
                loginAttemps: 0,
            });

            await newAdmin.save();

            return res.status(201).json({
                status: 201,
                message: "Administrador creado exitosamente.",
                data: null
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error - Check Server logs"
            });
        }
    }
};
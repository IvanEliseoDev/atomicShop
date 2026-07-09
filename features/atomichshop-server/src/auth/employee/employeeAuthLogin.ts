import { Request, Response } from "express";
import bcrypt from "bcrypt"; // ¡No olvides el import!
import { employeeModel } from "../../models/employee";
import jwt from "jsonwebtoken";
import { config } from "../../config";

export const employeeAuthLogin = {
  loginEmployee: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const employee = await employeeModel.findOne({ email });
      if (!employee) {
        return res
          .status(404)
          .json({ status: 404, message: "Usuario no encontrado" });
      }
      // Cuenta deshabilitada por un administrador
      if (!employee.isVerified) {
        return res
          .status(403)
          .json({ status: 403, message: "Cuenta deshabilitada. Contacta al administrador." });
      }
      //Verificamos si la cuenta está bloqueada
      if (employee.timeOut && employee.timeOut > Date.now()) {
        return res
          .status(403)
          .json({ message: "Cuenta bloqueada temporalmente" });
      }

      //Comparamos la contraseña
      const isMatch = await bcrypt.compare(password, employee.password || "");

      if (!isMatch) {
        // Incrementar intentos
        employee.loginAttemps = (employee.loginAttemps || 0) + 1;
        if (employee.loginAttemps >= 5) {
          employee.timeOut = Date.now() + 10 * 60 * 1000; // Bloqueo 10 min
          employee.loginAttemps = 0;
        }
        await employee.save();
        return res
          .status(401)
          .json({ status: 401, message: "Credenciales inválidas", data: null });
      }
      employee.loginAttemps = 0;
      employee.timeOut = undefined;
      await employee.save();
      //Crear el token
      const token = jwt.sign(
        //¿que vamos a guardar?
        {
          id: employee._id,
          userType: "employee",
          position: employee.position,
          email: employee.email,
        },
        //#2- Secret key
        config.jwt.secret,
        //#3- cuando expira
        { expiresIn: "30d" },
      );
      res.cookie("authCookieEmployee", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      const dataReturn = {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
      };
      return res
        .status(200)
        .json({ status: 200, message: "Login exitoso", data: dataReturn });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ status: 500, message: "Error interno" });
    }
  },
};

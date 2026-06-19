import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { customerModel } from "../../../models/customer";
import { config } from "../../../config";

export const loginEcommerceController = {
  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { mail, password } = req.body;

      const userFound = await customerModel.findOne({ mail });
      if (!userFound) {
        return res.status(404).json({ status: "404", message: "Email not found" });
      }

      // Verificar si la cuenta esta bloqueada
      if (userFound.timeOut && userFound.timeOut.getTime() > Date.now()) {
        return res.status(403).json({ status: "403", message: "Account blocked" });
      }

      // Verificar que el cliente haya verificado su correo
      if (!userFound.state || userFound.state === "unverified") {
        return res.status(403).json({ status: "403", message: "Email not verified" });
      }

      const isMatch = await bcrypt.compare(password, userFound.password as string);

      if (!isMatch) {
        userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;

        if (userFound.loginAttemps >= 5) {
          userFound.timeOut = new Date(Date.now() + 15 * 60 * 1000);
          userFound.loginAttemps = 0;
          await userFound.save();
          return res.status(403).json({ status: "403", message: "Account blocked" });
        }

        await userFound.save();
        return res.status(401).json({ status: "401", message: "Incorrect password" });
      }

      // Limpiar intentos fallidos
      userFound.loginAttemps = 0;
      userFound.timeOut = null;
      await userFound.save();

      const token = jsonwebtoken.sign(
        { id: userFound._id, userType: "customer" },
        config.jwt.secret,
        { expiresIn: "30d" }
      );

      res.cookie("authCookie", token, {
        httpOnly: true,
        sameSite: "lax",   // ← permite que se envíe en el mismo origen
        secure: false,      // ← false en desarrollo (sin HTTPS)
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días en ms
      });

      return res.status(200).json({ status: "200", message: "Successful login" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" });
    }
  },
  me: async (req: Request, res: Response): Promise<any> => {
    try {
      const token = req.cookies.authCookie;
      if (!token) {
        return res.status(401).json({ status: "401", message: "No session" });
      }

      const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

      const user = await customerModel.findById(decoded.id).select("_id name mail image");

      if (!user) {
        return res.status(404).json({ status: "404", message: "User not found" });
      }

      return res.status(200).json({
        status: "200",
        user: {
          id: user._id,
          name: user.name,
          mail: user.mail,
          profilePic: user.image  
        }
      });
    } catch (error) {
      return res.status(401).json({ status: "401", message: "Invalid session" });
    }
  },
};
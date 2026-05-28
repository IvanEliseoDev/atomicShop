import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { config } from "../../config";

export const verifyEmployeeToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authCookieEmployee;
    if (!token) {
        return res.status(401).json({ message: "No autorizado, token inexistente" });
    }
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        (req as any).user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
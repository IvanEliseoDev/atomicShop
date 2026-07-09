import { Request, Response } from "express"

export const employeeAuthLogout = {

    logOut: async(req:Request, res:Response) => {
        try {
            res.clearCookie("authCookieEmployee", {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            return res.status(200).json({ status:200, message: "Sesión cerrada" , data: null});
        } catch (error) {
            
        }
    }
}
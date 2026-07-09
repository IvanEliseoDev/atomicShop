import { Request, Response } from 'express';

export const logoutEcommerceController = {
    logout: async (req: Request, res: Response): Promise<any> => {
        try {
            const isProd = process.env.NODE_ENV === "production";
            res.clearCookie('authCookie', {
                httpOnly: true,
                sameSite: isProd ? "none" : "lax",
                secure: isProd,
            });
            return res.status(200).json({ status: '200', message: 'Session closed' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    }
};
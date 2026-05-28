import { Request, Response } from "express";
import { customerSeed } from "./customer/customer.seed";

export const seedService = {
    seedExecute: async(req:Request, res:Response) => {
        
        await customerSeed()
        
        return res.status(200).json({status: 201, message: "Seed Executed Succesfully"})
    }
}
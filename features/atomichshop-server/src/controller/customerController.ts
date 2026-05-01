import { Response } from 'express';
import { customerModel } from '../models/customer.model';

export const customerController = {

    getCustomer: async (req: Request, res: Response) => {
        try {
            const customers = customerModel.find()
            if (!customers) return res.status(404).json({ status: "404", message: "Customer Not Found" })
            return res.status(200).json({ status: '200', message: "Customers find successfully", data: customers })
        }catch(error){
            console.log(error)
            return res.status(500).json({status:"500", message: "Internal Server Error - Check Server Logs"})
        }
    }

}



import { Request, Response } from 'express';
import { customerModel } from '../models/customer.model';

export const customerController = {
    getCustomer: async (req: Request, res: Response): Promise<any> => {
        try {
            const customers = await customerModel.find()
            if (!customers) return res.status(404).json({ status: "404", message: "Customer Not Found" })
            return res.status(200).json({ status: '200', message: "Customers find successfully", data: customers })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" })
        }
    },
    insertCustomer: async (req: Request, res: Response) => {
        try {
            const customer = new customerModel(req.body)
            const result = await customer.save()
            if (!result) return res.status(401).json({ status: "401", message: "Error - Customer can't register" })
            res.status(201).json({ status: "201", message: "Create - Customer create has successfully", data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" })
        }
    },
    updateCustomer: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await customerModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!result) return res.status(401).json({ status: 401, message: "Customer can't update" })
            return res.status(200).json({ status: 200, message: "Customer updated has successfully", data: result });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" })
        }
    },
    deleteCustomer: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!id) return res.status(400).json({ status: 400, message: "Bad Request - Id is null" })
            const result = await customerModel.findByIdAndDelete(id)
            if (!result) return res.status(409).json({ status: 409, message: "Can't delete customer - conflict check server logs" })
            return res.status(204).json({status:204, message: "Customer delete success", data: true})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: "500", message: "Internal Server Error - Check Server Logs" })
        }

    }



}



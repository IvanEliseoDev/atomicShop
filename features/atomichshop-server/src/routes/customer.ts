import express from 'express';
import { customerController } from '../controller/customerController';

export const customerRouter = express.Router()

customerRouter.route("/")
.get(customerController.getCustomer)
.post(customerController.insertCustomer)

customerRouter.route("/:id")
.put(customerController.updateCustomer)
.delete(customerController.deleteCustomer)

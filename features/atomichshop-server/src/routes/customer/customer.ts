import express from 'express';
import { customerController } from '../../controller/customer/customerController';

export const customerRouter = express.Router()

customerRouter.route("/")
.get(customerController.getCustomer)
.post(customerController.insertCustomer)

customerRouter.route("/:id")
.get(customerController.getCustomerByID)
.put(customerController.updateCustomer)
.delete(customerController.deleteCustomer)

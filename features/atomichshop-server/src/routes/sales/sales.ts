import express from 'express';
import { saleController } from '../../controller/sales/sales';
import { validateInvoiceRequest } from '../../middleware/validations/comercialInvoice.validation.middleware';

export const salesRouter = express.Router()

salesRouter.route("/").get(saleController.getAllSales)
salesRouter.route("/comercial-invoice").post(validateInvoiceRequest, saleController.registerInvoiceComercial)
salesRouter.route("/tax-credit-invoice").post(saleController.registerTaxCreditInvoice)
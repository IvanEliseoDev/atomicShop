import express from 'express';
import { saleController } from '../../controller/sales/sales';
import { validateInvoiceRequest } from '../../middleware/validations/comercialInvoice.validation.middleware';
import { validateTaxCreditRequest } from '../../middleware/validations/taxcreditinvoice.validation.middleware';

export const salesRouter = express.Router()

salesRouter.route("/").get(saleController.getAllSales)
salesRouter.route("/all").get(saleController.getAllSalesUnified)
salesRouter.route("/comercial-invoice").post(validateInvoiceRequest, saleController.registerInvoiceComercial)
salesRouter.route("/tax-credit-invoice").post(validateTaxCreditRequest, saleController.registerTaxCreditInvoice)
salesRouter.route("/:id").get(saleController.getSaleByIdAndType).put(saleController.updateInvoice).delete(saleController.deleteInvoice)


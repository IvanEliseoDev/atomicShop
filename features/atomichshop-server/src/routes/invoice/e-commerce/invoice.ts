import express from "express";
import { invoiceEcommerceController } from "../../../controller/invoice/e-commerce/invoiceController";

const router = express.Router();

// Crear una nueva factura al finalizar la compra
router.route("/").post(invoiceEcommerceController.createInvoice);

// Obtener todas las facturas de un cliente (historial de compras)
router.route("/customer/:customerId").get(invoiceEcommerceController.getInvoicesByCustomer);

// Obtener el detalle de una factura especifica
router.route("/:invoiceId").get(invoiceEcommerceController.getInvoiceById);

export default router;
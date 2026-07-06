import express from "express";
import { invoiceAdminController } from "../../../controller/invoice/admin/invoiceAdminController";

const router = express.Router();

router.route("/").get(invoiceAdminController.getAllInvoices);
router.route("/:id/toggle").put(invoiceAdminController.toggleInvoiceState);

export default router;

import { Request, Response } from "express";
import { invoiceModel } from "../../../models/invoice";

export const invoiceAdminController = {
  getAllInvoices: async (_req: Request, res: Response): Promise<any> => {
    try {
      const invoices = await invoiceModel
        .find()
        .populate("customerId", "name mail telephone")
        .populate("products.productId", "name images price")
        .sort({ dateCreation: -1 });

      return res.status(200).json({
        status: 200,
        message: "Facturas obtenidas exitosamente",
        data: invoices,
      });
    } catch (error) {
      console.error("Error en getAllInvoices:", error);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  },

  toggleInvoiceState: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const invoice = await invoiceModel.findById(id);

      if (!invoice) {
        return res.status(404).json({ status: 404, message: "Factura no encontrada" });
      }

      invoice.state = !invoice.state;
      await invoice.save();

      return res.status(200).json({
        status: 200,
        message: `Factura ${invoice.state ? "activada" : "desactivada"} exitosamente`,
        data: invoice,
      });
    } catch (error) {
      console.error("Error en toggleInvoiceState:", error);
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  },
};

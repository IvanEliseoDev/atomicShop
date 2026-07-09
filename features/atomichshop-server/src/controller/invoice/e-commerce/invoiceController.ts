import { Request, Response } from "express";
import { invoiceModel } from "../../../models/invoice";
import { modelCarts } from "../../../models/cart";
import { customerModel } from "../../../models/customer";
import { modelProducts } from "../../../models/product";
import { config } from "../../../config";
import { transporter } from "../../../utils/mailer";
import { generateInvoicePDF } from "../../../utils/generateInvoicePDF";
import { HTMLInvoiceEmail } from "../../../utils/HTMLInvoiceEmail";

// Genera el numero correlativo de factura con formato FCF-000001
const generateInvoiceNumber = async (): Promise<string> => {
  // Cuenta cuantas facturas existen para calcular el siguiente numero
  const count = await invoiceModel.countDocuments();
  const padded = String(count + 1).padStart(6, "0");
  return `FCF-${padded}`;
};

export const invoiceEcommerceController = {
  // POST /e-commerce/invoices
  // Recibe los datos de entrega, metodo de pago y el resultado del pago de Wompi.
  // Calcula los totales desde la BD, crea la factura, envia el correo y vacia el carrito.
  createInvoice: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        customerId,
        deliveryData, // { direccion, departamento, municipio, fechaEntrega? }
        paymentMethod, // "credito" | "debito" | "efectivo"
        wompiTransactionId, // string | null — viene del frontend despues de pagar con Wompi
      } = req.body;

      // 1. Verificar que el cliente existe y obtener su correo para el envio
      const customer = await customerModel.findById(customerId);
      if (!customer) {
        return res
          .status(404)
          .json({ status: "404", message: "Cliente no encontrado" });
      }

      // 2. Obtener el carrito activo del cliente
      const cart = await modelCarts
        .findOne({ clientId: customerId })
        .populate("products.idProduct", "name price discount");

      if (!cart || cart.products.length === 0) {
        return res
          .status(400)
          .json({ status: "400", message: "El carrito esta vacio" });
      }

      // 3. Calcular totales desde la BD (nunca desde el frontend)
      let subtotal = 0;
      let discountTotal = 0;
      const invoiceProducts = [];

      for (const item of cart.products) {
        const product = item.idProduct as any; // poblado por populate
        const unitPrice = product.price;
        const discountPercent = product.discount ?? 0;
        const discountAmount = unitPrice * (discountPercent / 100);
        const priceWithDiscount = unitPrice - discountAmount;
        const subtotalLine = priceWithDiscount * item.amount;

        subtotal += unitPrice * item.amount;
        discountTotal += discountAmount * item.amount;

        invoiceProducts.push({
          productId: product._id,
          quantity: item.amount,
          unitPrice,
          discount: discountPercent,
          subtotalLine,
        });
      }

      const total = subtotal - discountTotal;

      // 4. Generar numero correlativo unico de factura
      const invoiceNumber = await generateInvoiceNumber();

      // 5. Crear y guardar la factura en la coleccion sales
      const newInvoice = new invoiceModel({
        invoiceNumber,
        customerId,
        products: invoiceProducts,
        deliveryData,
        subtotal,
        discountTotal,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "efectivo" ? "pendiente" : "pagado",
        wompiTransactionId: wompiTransactionId ?? null,
        state: true,
        dateCreation: new Date(),
      });

      await newInvoice.save();

      // Descontar stock de cada producto comprado
      for (const item of invoiceProducts) {
        await modelProducts.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      const invoicePopulated = await invoiceModel
        .findById(newInvoice._id)
        .populate("products.productId", "name");

      // 6. Generar el PDF de la factura como Buffer para adjuntarlo al correo
      const pdfBuffer = await generateInvoicePDF({
        invoice: invoicePopulated,
        customerName: customer.name,
        customerMail: customer.mail,
      });

      // 7. Enviar el correo con la factura adjunta al cliente
      const mailOptions = {
        from: config.email.from,
        to: customer.mail,
        subject: `AtomicShop - Factura de tu compra ${invoiceNumber}`,
        html: HTMLInvoiceEmail(customer.name, invoiceNumber, total),
        attachments: [
          {
            filename: `${invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      console.log(`[EMAIL] Intentando enviar factura ${invoiceNumber} a ${customer.mail}`);
      transporter.sendMail(mailOptions).then(() => {
        console.log(`[EMAIL] Factura ${invoiceNumber} enviada exitosamente a ${customer.mail}`);
      }).catch((mailError: any) => {
        console.error(`[EMAIL] Error al enviar factura ${invoiceNumber} a ${customer.mail}:`, mailError?.message || mailError);
      });

      // 8. Vaciar el carrito del cliente en la BD
      await modelCarts.findOneAndUpdate(
        { clientId: customerId },
        { $set: { products: [] } },
      );

      return res.status(201).json({
        status: "201",
        message: "Compra realizada exitosamente",
        data: newInvoice,
      });
    } catch (error) {
      console.error("Error en createInvoice:", error);
      return res.status(500).json({
        status: "500",
        message: "Internal Server Error - Check Server Logs",
      });
    }
  },

  // GET /e-commerce/invoices/customer/:customerId
  // Retorna todas las facturas de un cliente para su historial de compras
  getInvoicesByCustomer: async (req: Request, res: Response): Promise<any> => {
    try {
      const { customerId } = req.params;

      const invoices = await invoiceModel
        .find({ customerId, state: true })
        .populate("products.productId", "name images")
        .sort({ dateCreation: -1 }); // mas reciente primero

      return res.status(200).json({ status: "200", data: invoices });
    } catch (error) {
      console.error("Error en getInvoicesByCustomer:", error);
      return res.status(500).json({
        status: "500",
        message: "Internal Server Error - Check Server Logs",
      });
    }
  },

  // GET /e-commerce/invoices/:invoiceId
  // Retorna el detalle completo de una factura especifica
  getInvoiceById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { invoiceId } = req.params;

      const invoice = await invoiceModel
        .findById(invoiceId)
        .populate("customerId", "name mail telephone")
        .populate("products.productId", "name images price");

      if (!invoice) {
        return res
          .status(404)
          .json({ status: "404", message: "Factura no encontrada" });
      }

      return res.status(200).json({ status: "200", data: invoice });
    } catch (error) {
      console.error("Error en getInvoiceById:", error);
      return res.status(500).json({
        status: "500",
        message: "Internal Server Error - Check Server Logs",
      });
    }
  },
};

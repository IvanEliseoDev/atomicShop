import PDFDocument from "pdfkit";
import path from "path";

interface InvoicePDFParams {
  invoice: any;
  customerName: string;
  customerMail: string;
}

export const generateInvoicePDF = (
  params: InvoicePDFParams,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const { invoice, customerName, customerMail } = params;
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const primaryColor = "#0ea5e9";
    const darkColor = "#0c4a6e";
    const grayColor = "#6b7280";
    const lightGray = "#f3f4f6";

    const logoPath = path.resolve(
      process.cwd(),
      "src/assets/logoatomicshop_blanco.png",
    );

    // ── Encabezado ──────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 90).fill(primaryColor);

    // Logo en lugar del texto "AtomicShop"
    doc.image(logoPath, 50, 15, { height: 60 });

    // Número de factura y título alineados correctamente a la derecha
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#ffffff")
      .text("FACTURA DE CONSUMIDOR FINAL", 0, 30, {
        align: "right",
        width: doc.page.width - 50,
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#e0f2fe")
      .text(`No. ${invoice.invoiceNumber}`, 0, 48, {
        align: "right",
        width: doc.page.width - 50,
      });

    // ── Datos del cliente ────────────────────────────────────────────────────
    doc.moveDown(3);
    doc
      .fillColor(darkColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("DATOS DEL CLIENTE", 50);
    doc
      .moveTo(50, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor(primaryColor)
      .lineWidth(1.5)
      .stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`Nombre: ${customerName}`);
    doc.text(`Correo: ${customerMail}`);
    doc.text(`Metodo de pago: ${invoice.paymentMethod}`);
    doc.text(
      `Fecha de emision: ${new Date(invoice.dateCreation).toLocaleDateString("es-SV")}`,
    );

    // ── Datos de entrega ─────────────────────────────────────────────────────
    doc.moveDown(1);
    doc
      .fillColor(darkColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("DATOS DE ENTREGA");
    doc
      .moveTo(50, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor(primaryColor)
      .lineWidth(1.5)
      .stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`Direccion: ${invoice.deliveryData.direccion}`);
    doc.text(`Departamento: ${invoice.deliveryData.departamento}`);
    doc.text(`Municipio: ${invoice.deliveryData.municipio}`);
    if (invoice.deliveryData.fechaEntrega) {
      doc.text(
        `Fecha de entrega: ${new Date(invoice.deliveryData.fechaEntrega).toLocaleDateString("es-SV")}`,
      );
    }

    // ── Tabla de productos ───────────────────────────────────────────────────
    doc.moveDown(1);
    doc
      .fillColor(darkColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("DETALLE DE PRODUCTOS");
    doc
      .moveTo(50, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor(primaryColor)
      .lineWidth(1.5)
      .stroke();
    doc.moveDown(0.5);

    // Cabecera de tabla
    const tableTop = doc.y;
    doc.rect(50, tableTop, 495, 20).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    doc.text("Producto", 55, tableTop + 5, { width: 200 });
    doc.text("Cant.", 260, tableTop + 5, { width: 50, align: "center" });
    doc.text("Precio U.", 315, tableTop + 5, { width: 80, align: "right" });
    doc.text("Desc.", 400, tableTop + 5, { width: 50, align: "right" });
    doc.text("Subtotal", 455, tableTop + 5, { width: 85, align: "right" });

    // Filas de productos
    let rowY = tableTop + 22;
    invoice.products.forEach((item: any, index: number) => {
      const rowColor = index % 2 === 0 ? "#ffffff" : lightGray;
      doc.rect(50, rowY, 495, 18).fill(rowColor);

      doc.fillColor("#374151").fontSize(9).font("Helvetica");
      const productName = item.productId?.name ?? `Producto ${index + 1}`;
      doc.text(productName, 55, rowY + 4, { width: 200 });
      doc.text(String(item.quantity), 260, rowY + 4, {
        width: 50,
        align: "center",
      });
      doc.text(`$${item.unitPrice.toFixed(2)}`, 315, rowY + 4, {
        width: 80,
        align: "right",
      });
      doc.text(`${item.discount}%`, 400, rowY + 4, {
        width: 50,
        align: "right",
      });
      doc.text(`$${item.subtotalLine.toFixed(2)}`, 455, rowY + 4, {
        width: 85,
        align: "right",
      });

      rowY += 20;
    });

    // Borde de la tabla
    doc
      .rect(50, tableTop, 495, rowY - tableTop)
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .stroke();

    // ── Totales ──────────────────────────────────────────────────────────────
    doc.moveDown(1.5);
    const totalsX = 350;

    doc.fontSize(10).font("Helvetica").fillColor(grayColor);
    doc.text("Subtotal:", totalsX, doc.y, { continued: true });
    doc
      .fillColor("#374151")
      .text(`$${invoice.subtotal.toFixed(2)}`, { align: "right" });

    doc
      .fillColor(grayColor)
      .text("Descuento total:", totalsX, doc.y, { continued: true });
    doc
      .fillColor("#374151")
      .text(`-$${invoice.discountTotal.toFixed(2)}`, { align: "right" });

    doc
      .moveTo(totalsX, doc.y + 4)
      .lineTo(545, doc.y + 4)
      .strokeColor("#d1d5db")
      .lineWidth(0.8)
      .stroke();
    doc.moveDown(0.6);

    doc.fontSize(13).font("Helvetica-Bold").fillColor(darkColor);
    doc.text("TOTAL A PAGAR:", totalsX, doc.y, { continued: true });
    doc
      .fillColor(primaryColor)
      .text(`$${invoice.total.toFixed(2)}`, { align: "right" });

    // ── Pie de página ────────────────────────────────────────────────────────
    doc.fontSize(8).font("Helvetica").fillColor(grayColor);
    const footerY = doc.page.height - 60;
    doc
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .stroke();
    doc.text(
      "Este documento es una factura de consumidor final generada electronicamente por AtomicShop.",
      50,
      footerY + 10,
      { align: "center", width: 495 },
    );
    doc.text(
      `© ${new Date().getFullYear()} AtomicShop — Todos los derechos reservados.`,
      50,
      footerY + 22,
      { align: "center", width: 495 },
    );

    doc.end();
  });
};

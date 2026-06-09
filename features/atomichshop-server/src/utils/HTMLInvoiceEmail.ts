
export const HTMLInvoiceEmail = (
    customerName: string,
    invoiceNumber: string,
    total: number
): string => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0ea5e9; margin: 0;">AtomicShop</h2>
          <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">Laboratorio de calidad</p>
        </div>

        <h3 style="color: #333; text-align: center;">Gracias por tu compra, ${customerName}</h3>

        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Tu pedido ha sido procesado correctamente. Adjunto a este correo encontraras tu factura en formato PDF.
        </p>

        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; color: #0369a1; font-size: 14px;">Numero de factura</p>
          <p style="margin: 8px 0 0; color: #0c4a6e; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${invoiceNumber}</p>
          <p style="margin: 12px 0 0; color: #374151; font-size: 18px; font-weight: bold;">Total pagado: $${total.toFixed(2)}</p>
        </div>

        <p style="color: #777; font-size: 14px; text-align: center;">
          Si tienes alguna duda sobre tu pedido, contactanos respondiendo a este correo.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} AtomicShop — Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;
};
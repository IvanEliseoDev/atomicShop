import { Request, Response } from "express";
import { transporter } from "../utils/mailer";
import { config } from "../config";

export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
  const { nombre, telefono, correo, mensaje } = req.body;

  if (!nombre || !telefono || !correo || !mensaje) {
    res.status(400).json({ message: "Todos los campos son requeridos" });
    return;
  }

  try {
    await transporter.sendMail({
      from: `"AtomicShop Web" <${config.email.from}>`,
      to: config.email.from,
      replyTo: correo,       // al responder, va al cliente
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `,
    });

    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Error al enviar el correo", error: err.message });
  }
};
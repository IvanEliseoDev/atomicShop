export const HTMLRecoveryEmail = (code: string): string => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1d4ed8; margin: 0;">AtomicShop</h2>
          <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">Laboratorio de calidad</p>
        </div>

        <h3 style="color: #333; text-align: center;">Recuperación de contraseña</h3>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente código para continuar:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 15px 30px; font-size: 28px; font-weight: bold; border-radius: 8px; letter-spacing: 8px;">
            ${code}
          </span>
        </div>

        <p style="color: #777; font-size: 14px; text-align: center;">
          Este código expirará en <strong>15 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este correo.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} AtomicShop — Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;
};
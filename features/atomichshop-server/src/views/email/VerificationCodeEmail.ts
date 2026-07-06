export const HTMLVerifyEmail = (name: string, mail: string, password: string) => {
    return `
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#e3f2fd;color:#333;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="480" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header azul -->
          <tr>
            <td style="background:linear-gradient(135deg,#2196f3,#1565c0);padding:36px 40px;text-align:center;">
              <img src="https://i.ibb.co/ZpDC1f2W/Logo-factura-D-AKSI-1.png" alt="AtomicShop" width="64"
                   style="display:inline-block;vertical-align:middle;margin-bottom:12px;" />
              <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;letter-spacing:0.5px;">
                AtomicShop
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:#bbdefb;">Panel Administrativo</p>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="padding:36px 40px 0;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;font-weight:600;">
                ¡Bienvenido/a, ${name}!
              </h2>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
                Tu cuenta de empleado en <strong>AtomicShop</strong> ha sido creada exitosamente por un administrador.
                A continuación encontrarás tus credenciales de acceso al sistema:
              </p>
            </td>
          </tr>

          <!-- Credenciales -->
          <tr>
            <td style="padding:28px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%"
                     style="background-color:#f0f7ff;border-radius:8px;border:1px solid #bbdefb;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#1565c0;text-transform:uppercase;letter-spacing:1px;">
                      Tus credenciales de acceso
                    </p>
                    <hr style="border:none;border-top:1px solid #bbdefb;margin:10px 0 16px;" />

                    <!-- Correo -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                      <tr>
                        <td width="20" style="vertical-align:middle;">
                          <span style="display:inline-block;width:8px;height:8px;background:#2196f3;border-radius:50%;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:13px;color:#555;font-weight:600;">Correo electrónico</p>
                          <p style="margin:2px 0 0;font-size:15px;color:#1a1a1a;font-weight:700;">${mail}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Contraseña -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="20" style="vertical-align:middle;">
                          <span style="display:inline-block;width:8px;height:8px;background:#2196f3;border-radius:50%;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:13px;color:#555;font-weight:600;">Contraseña temporal</p>
                          <p style="margin:2px 0 0;font-size:18px;color:#1a1a1a;font-weight:700;letter-spacing:2px;font-family:monospace;">
                            ${password}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Aviso -->
          <tr>
            <td style="padding:0 40px 28px;">
              <p style="margin:0;font-size:13px;color:#888;line-height:1.5;">
                Por tu seguridad, te recomendamos cambiar tu contraseña la primera vez que inicies sesión.
                Si tienes algún problema para acceder, contacta al administrador del sistema.
              </p>
            </td>
          </tr>

          <!-- Botón -->
          <tr>
            <td align="center" style="padding:0 40px 36px;">
              <a href="http://localhost:5173/login"
                 style="display:inline-block;background-color:#2196f3;color:#ffffff;padding:14px 48px;
                        text-decoration:none;border-radius:6px;font-weight:700;font-size:15px;">
                Ir al sistema
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f5f5;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
              <p style="margin:0;font-size:12px;color:#999;">
                Este correo fue generado automáticamente por AtomicShop. No responder a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
    `;
};

export const HTMLVerifyEmail = (code: String, name: String, mail: String, password: String) => {
    return `
   <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #e3f2fd; color: #333;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 40px 0 40px 0;">
              
                <table border="0" cellpadding="0" cellspacing="0" width="450" style="background-color: transparent;">
                    
                    <!-- Logo -->
                   <tr>
                        <td align="left" style="padding-bottom: 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="font-weight: bold; font-size: 18px; color: #1a1a1a; letter-spacing: 1px;">
                                        <img src="https://i.ibb.co/ZpDC1f2W/Logo-factura-D-AKSI-1.png" alt="Logo" width="70" style="display: inline-block; vertical-align: middle; border: 0; margin-right: 8px;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom: 10px;">
                            <h1 style="margin: 0; font-size: 28px; color: #444; font-weight: 700;">Completa tu registro</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #666;">
                                Hola ${name} !!!
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #666;">
                                Se ha creado tu perfil de empleado exitosamente.<br>
                                Para finalizar el proceso, solo debes verificar tu acceso.
                            </p>
                        </td>
                    </tr>
                    <tr>
                    <td align="center" style="padding-bottom: 40px;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #666;">
                                Codigo expira en 15 minutos
                            </p>
                        </td>
                    </tr>

                    <!-- Código de Verificación -->
                    <tr>
                        <td align="left" style="padding-bottom: 10px;">
                            <span style="font-size: 14px; font-weight: bold; color: #555;">Codigo de Verificacion</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="font-size: 32px; font-weight: bold; letter-spacing: 15px; color: #000;">
                                        ${code}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Credenciales -->
                    <tr>
                        <td align="left" style="padding: 40px 0 10px 0;">
                            <span style="font-size: 16px; font-weight: bold; color: #555;">Tus credenciales son:</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-bottom: 5px;">
                            <p style="margin: 0; font-size: 15px; color: #444;">
                                <strong>Correo:</strong> <span style="color: #666;">${mail}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-bottom: 40px;">
                            <p style="margin: 0; font-size: 15px; color: #444;">
                                <strong>Contraseña Generica:</strong> <span style="color: #666;">${password}</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Botón -->
                    <tr>
                        <td align="center">
                            <a href="localhost:5173/atomicAdmin" style="background-color: #5dade2; color: #ffffff; padding: 15px 60px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                                AtomicShop
                            </a>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
    `;
};
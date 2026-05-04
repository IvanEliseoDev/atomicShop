export const HTMLVerifyEmail = (code: String, name:String) => {
    return `
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e0f2ff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e0f2ff; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: transparent;">
                    
                    <tr>
                        <td align="left" style="padding-bottom: 40px;">
                            <h2 style="color: #4da3e0; margin: 0; font-size: 18px; font-weight: bold;">AtomicShop - Admin</h2>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom: 10px;">
                            <h1 style="color: #444444; margin: 0; font-size: 28px; font-weight: bold;">Completa tu registro</h1>
                        </td>
                    </tr>

                     <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.5;">
                                Hola ${name} !!!
                            </p>
                        </td>
                         
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.5;">
                                Se ha creado tu perfil de empleado exitosamente. Para finalizar el proceso, solo debes verificar tu acceso
                            </p>
                        </td>
                         
                    </tr>
                    <tr>
                    
                    </tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <p style="color: #FF0000; margin: 0; font-size: 16px; line-height: 1.5;">
                                Codigo expira dentro de 15 minutos
                            </p>
                        </td>
                    <tr>
                        <td align="left" style="padding-bottom: 10px;">
                            <span style="color: #444444; font-weight: bold; font-size: 16px;">Codigo de Verificacion</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 15px; color: #333333; font-family: monospace;">
                                    ${code}
                                </span>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td align="center">
                            <a href="http://localhost:5174/atomicAdmin" target="_blank" style="display: inline-block; background-color: #63ace5; color: #ffffff; padding: 15px 60px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
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
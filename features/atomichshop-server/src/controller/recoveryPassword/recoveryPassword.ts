import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { employeeModel } from '../../models/employee';
import { config } from '../../config';
import { HTMLRecoveryEmail } from '../../utils/HTMLRecoveryEmail';

export const recoveryPasswordAdminController = {
    requestCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: 400, message: 'El correo es requerido' });
            }

            const employeeFound = await employeeModel.findOne({ email });
            if (!employeeFound) {
                return res.status(404).json({ status: 404, message: 'Correo no encontrado' });
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const token = jsonwebtoken.sign(
                { email, code, userType: 'employee', verified: false },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            res.cookie('recoveryEmployeeCookie', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.email.password,
                },
                tls: { rejectUnauthorized: false },
            });

            const mailOptions = {
                from: config.email.user,
                to: email,
                subject: 'AtomicShop — Recuperación de contraseña',
                html: HTMLRecoveryEmail(code),
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: 'Error al enviar el correo' });
                }
                return res.status(200).json({ status: 200, message: 'Código enviado exitosamente' });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: 'Internal Server Error - Check Server Logs' });
        }
    },

    verifyCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { codeRequest } = req.body;

            const token = req.cookies.recoveryEmployeeCookie;
            if (!token) {
                return res.status(400).json({ status: 400, message: 'Token de recuperación no encontrado. Vuelve a solicitar el código.' });
            }

            const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

            if (decoded.code !== codeRequest) {
                return res.status(400).json({ status: 400, message: 'Código incorrecto o expirado' });
            }

            const newToken = jsonwebtoken.sign(
                { email: decoded.email, userType: 'employee', verified: true },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            res.cookie('recoveryEmployeeCookie', newToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            return res.status(200).json({ status: 200, message: 'Código verificado exitosamente' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: 'Internal Server Error - Check Server Logs' });
        }
    },

    newPassword: async (req: Request, res: Response): Promise<any> => {
        try {
            const { newPassword, confirmNewPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ status: 400, message: 'Las contraseñas no coinciden' });
            }

            const token = req.cookies.recoveryEmployeeCookie;
            if (!token) {
                return res.status(400).json({ status: 400, message: 'Token de recuperación no encontrado. Reinicia el proceso.' });
            }

            const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

            if (!decoded.verified) {
                return res.status(400).json({ status: 400, message: 'El código no ha sido verificado' });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10);

            const result = await employeeModel.findOneAndUpdate(
                { email: decoded.email },
                { password: passwordHash, isGenericPassword: false },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({ status: 404, message: 'Empleado no encontrado' });
            }

            res.clearCookie('recoveryEmployeeCookie', { path: '/' });

            return res.status(200).json({ status: 200, message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, message: 'Internal Server Error - Check Server Logs' });
        }
    },
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { customerModel } from '../../../models/customer';
import { employeeModel } from '../../../models/employee';
import { config } from '../../../config';
import { transporter } from '../../../utils/mailer';
import { HTMLVerificationEmail } from '../../../utils/HTMLVerificationEmail';

export const registerCustomerEcommerceController = {
    register: async (req: Request, res: Response): Promise<any> => {
        try {
            const { name, mail, password, telephone, direction, deparmet, municipality, typeCustomer, dui, nit, typeActivity } = req.body;

            const existCustomer = await customerModel.findOne({ mail });
            if (existCustomer) {
                return res.status(400).json({ status: '400', message: 'Customer already exists' });
            }

            const existEmployee = await employeeModel.findOne({ email: mail });
            if (existEmployee) {
                return res.status(400).json({ status: '400', message: 'Email already registered as employee' });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Guardamos el código en la BD para que verifyCode pueda leerlo
            // aunque la cookie no esté disponible (strict:false lo permite sin cambiar el schema)
            const newCustomer = new customerModel({
                name,
                mail,
                password: passwordHash,
                telephone,
                direction,
                deparmet,
                municipality,
                typeCustomer: "consumidor final",
                dui,
                nit,
                typeActivity,
                state: 'unverified',
                loginAttemps: 0,
                timeOut: null,
                verificationCode,
            });

            await newCustomer.save();

            const tokenCode = jsonwebtoken.sign(
                { mail, verificationCode },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            const isProd = process.env.NODE_ENV === "production";
            res.cookie('verificationToken', tokenCode, {
                httpOnly: true,
                sameSite: isProd ? "none" : "lax",
                secure: isProd,
                maxAge: 15 * 60 * 1000,
            });

            // Email no-fatal: si falla, el registro igual se completa
            console.log(`[EMAIL] Intentando enviar verificación a ${mail} desde ${config.email.from} via ${config.email.host}:${config.email.port}`);
            transporter.sendMail({
                from: config.email.from,
                to: mail,
                subject: 'Verificacion de cuenta - AtomicShop',
                html: HTMLVerificationEmail(verificationCode),
            }).then(() => {
                console.log(`[EMAIL] Verificación enviada exitosamente a ${mail}`);
            }).catch((mailError: any) => {
                console.error(`[EMAIL] Error al enviar verificación a ${mail}:`, mailError?.message || mailError);
            });

            return res.status(201).json({ status: '201', message: 'Customer registered, verify your email' });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    },

    resendCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { mail } = req.body;
            if (!mail) {
                return res.status(400).json({ status: '400', message: 'Email is required' });
            }

            const customer = await customerModel.findOne({ mail });
            if (!customer) {
                return res.status(404).json({ status: '404', message: 'Customer not found' });
            }
            if (customer.state === 'active') {
                return res.status(400).json({ status: '400', message: 'Account already verified' });
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            (customer as any).verificationCode = verificationCode;
            await customer.save();

            const tokenCode = jsonwebtoken.sign(
                { mail, verificationCode },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            const isProd = process.env.NODE_ENV === "production";
            res.cookie('verificationToken', tokenCode, {
                httpOnly: true,
                sameSite: isProd ? "none" : "lax",
                secure: isProd,
                maxAge: 15 * 60 * 1000,
            });

            transporter.sendMail({
                from: config.email.from,
                to: mail,
                subject: 'Nuevo código de verificación - AtomicShop',
                html: HTMLVerificationEmail(verificationCode),
            }).then(() => {
                console.log(`[EMAIL] Reenvío de verificación enviado a ${mail}`);
            }).catch((mailError: any) => {
                console.error(`[EMAIL] Error al reenviar verificación a ${mail}:`, mailError?.message || mailError);
            });

            return res.status(200).json({ status: '200', message: 'Verification code resent' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    },

    verifyCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { verificationCodeRequest } = req.body;

            const token = req.cookies.verificationToken;

            let mail: string;
            let expectedCode: string;

            if (token) {
                // Flujo normal: cookie disponible
                const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);
                mail = decoded.mail;
                expectedCode = decoded.verificationCode;
            } else {
                // Flujo alternativo: buscar en BD por código (cuando la cookie expiró o no llegó)
                const customer = await customerModel.findOne({ verificationCode: verificationCodeRequest, state: 'unverified' });
                if (!customer) {
                    return res.status(400).json({ status: '400', message: 'Verification token not found' });
                }
                mail = customer.mail as string;
                expectedCode = verificationCodeRequest; // si lo encontró en BD, es correcto
            }

            if (verificationCodeRequest !== expectedCode) {
                return res.status(400).json({ status: '400', message: 'Invalid code' });
            }

            const customer = await customerModel.findOne({ mail });
            if (!customer) {
                return res.status(404).json({ status: '404', message: 'Customer not found' });
            }

            customer.state = 'active';
            (customer as any).verificationCode = undefined; // limpiar código usado
            await customer.save();

            res.clearCookie('verificationToken');

            return res.status(200).json({ status: '200', message: 'Email verified successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    }
};

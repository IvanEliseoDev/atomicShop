import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { customerModel } from '../../../models/customer';
import { config } from '../../../config';
import { HTMLRecoveryEmail } from '../../../utils/HTMLRecoveryEmail';

export const recoveryPasswordEcommerceController = {
    requestCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { mail } = req.body;

            const userFound = await customerModel.findOne({ mail });
            if (!userFound) {
                return res.status(404).json({ status: '404', message: 'User not found' });
            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const token = jsonwebtoken.sign(
                { mail, code, userType: 'customer', verified: false },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            res.cookie('recoveryCookie', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.email.password
                }
            });

            const mailOptions = {
                from: config.email.user,
                to: mail,
                subject: 'Correo de recuperacion de contrasena',
                html: HTMLRecoveryEmail(code)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: '500', message: 'Error sending email' });
                }
                return res.status(200).json({ status: '200', message: 'Email sent successfully' });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    },

    verifyCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { codeRequest } = req.body;

            const token = req.cookies.recoveryCookie;
            if (!token) {
                return res.status(400).json({ status: '400', message: 'Recovery token not found' });
            }

            const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

            if (decoded.code !== codeRequest) {
                return res.status(400).json({ status: '400', message: 'Invalid code' });
            }

            const newToken = jsonwebtoken.sign(
                { mail: decoded.mail, userType: 'customer', verified: true },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            res.cookie('recoveryCookie', newToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            return res.status(200).json({ status: '200', message: 'Code verified successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    },

    newPassword: async (req: Request, res: Response): Promise<any> => {
        try {
            const { newPassword, confirmNewPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ status: '400', message: 'Passwords do not match' });
            }

            const token = req.cookies.recoveryCookie;
            if (!token) {
                return res.status(400).json({ status: '400', message: 'Recovery token not found' });
            }

            const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

            if (!decoded.verified) {
                return res.status(400).json({ status: '400', message: 'Code not verified' });
            }

            const passwordHash = await bcrypt.hash(newPassword, 10);

            const result = await customerModel.findOneAndUpdate(
                { mail: decoded.mail },
                { password: passwordHash },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({ status: '404', message: 'Customer not found' });
            }

            res.clearCookie('recoveryCookie');

            return res.status(200).json({ status: '200', message: 'Password updated successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    }
};
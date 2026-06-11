import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { customerModel } from '../../../models/customer';
import { config } from '../../../config';
import { HTMLVerificationEmail } from '../../../utils/HTMLVerificationEmail';

export const registerCustomerEcommerceController = {
    register: async (req: Request, res: Response): Promise<any> => {
        try {
            const { name, mail, password, telephone, direction, deparmet, municipality, typeCustomer, dui, nit, typeActivity } = req.body;

            const existCustomer = await customerModel.findOne({ mail });
            if (existCustomer) {
                return res.status(400).json({ status: '400', message: 'Customer already exists' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

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
                timeOut: null
            });

            await newCustomer.save();

            // Solo numeros
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const tokenCode = jsonwebtoken.sign(
                { mail, verificationCode },
                config.jwt.secret,
                { expiresIn: '15m' }
            );

            res.cookie('verificationToken', tokenCode, { httpOnly: true, maxAge: 15 * 60 * 1000 });

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
                subject: 'Verificacion de cuenta',
                html: HTMLVerificationEmail(verificationCode)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ status: '500', message: 'Error sending verification email' });
                }
                return res.status(201).json({ status: '201', message: 'Customer registered, verify your email' });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    },

    verifyCode: async (req: Request, res: Response): Promise<any> => {
        try {
            const { verificationCodeRequest } = req.body;

            const token = req.cookies.verificationToken;
            if (!token) {
                return res.status(400).json({ status: '400', message: 'Verification token not found' });
            }

            const decoded: any = jsonwebtoken.verify(token, config.jwt.secret);

            if (verificationCodeRequest !== decoded.verificationCode) {
                return res.status(400).json({ status: '400', message: 'Invalid code' });
            }

            const customer = await customerModel.findOne({ mail: decoded.mail });
            if (!customer) {
                return res.status(404).json({ status: '404', message: 'Customer not found' });
            }

            customer.state = 'active';
            await customer.save();

            res.clearCookie('verificationToken');

            return res.status(200).json({ status: '200', message: 'Email verified successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: '500', message: 'Internal Server Error - Check Server Logs' });
        }
    }
};
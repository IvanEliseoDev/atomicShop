import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { employeeModel } from "../../models/employee";
import { generateRandomPassword } from "../../utils/generatedRandomPassword";
import { config } from "../../config";
import { MyTokenPayload } from "../../interface/employee.interface";
import { HTMLVerifyEmail } from "../../views/email/VerificationCodeEmail";

export const employeeController = {
  getEmployees: async (req: Request, res: Response) => {
    try {
      const employees = await employeeModel.find().lean();
      //Limpio la data para evitar mandar al frontEnd la password, loginAttemps etc porque no es algo que me interese cuando solo lo mostrare en una tabla
      const safeEmployees = employees.map((emp) => {
        const {
          password,
          loginAttemps,
          timeOut,
          isGenericPassword,
          ...publicData
        } = emp;
        return publicData;
      });
      return res
        .status(200)
        .json({
          status: 200,
          message: "Employees has find successfully",
          data: safeEmployees,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          status: 500,
          message: "Internal Server Error - Check Server logs",
        });
    }
  },
  getEmployeeByID: async (req: Request, res: Response) => {
    try {
      const _id = req.params.id;
      if (!_id)
        return res
          .status(400)
          .json({
            status: 400,
            message: "Bad Request - ID must be entered as a parameter",
            data: null,
          });
      const employeeFound = await employeeModel.findById(_id);
      if (!employeeFound)
        return res
          .status(404)
          .json({
            status: 404,
            message: "Not Found - Employee has not Found",
            data: employeeFound,
          });
      return res
        .status(200)
        .json({
          status: 200,
          message: "Employee has found successfully",
          data: employeeFound,
        });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          status: 500,
          message: "Internal Server Error - Check Server logs",
        });
    }
  },
  addEmployee: async (req: Request, res: Response) => {
    try {
      const employeeRequest = req.body;
      if (!employeeRequest)
        return res
          .status(404)
          .json({ status: 400, message: "Bad Request - request is null " });
      const existEmployee = await employeeModel.findOne({
        email: employeeRequest.email,
      });
      if (existEmployee)
        return res
          .status(409)
          .json({
            status: 409,
            message: "Employee has alredy exist",
            data: null,
          });
      const genericPassword = generateRandomPassword();
      const passwordHashed = await bcrypt.hash(genericPassword, 10);
      const newEmployee = new employeeModel({
        ...employeeRequest,
        password: passwordHashed,
        isGenericPassword: true,
        isVerified: false,
        loginAttemps: 0,
      });
      const { name, email } = employeeRequest;
      const verificationCode = crypto.randomBytes(3).toString("hex");
      const tokenCode = jwt.sign(
        { email, verificationCode },
        config.jwt.secret,
        { expiresIn: "15m" },
      );
      res.cookie("VerificationToken", tokenCode, { maxAge: 15 * 60 * 1000 });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: config.email.user,
        to: email,
        subject: "Correo de verificacion",
        body: "Use this code to verify account",
        html: HTMLVerifyEmail(verificationCode, name, email, genericPassword),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error, info);
          return res
            .status(400)
            .json({
              status: 400,
              message:
                "Error sending email, please verify that the email address exists and is valid",
              data: null,
            });
        }
      });
      await newEmployee.save();
      return res
        .status(201)
        .json({ message: "Employee Create Succesful", data: null });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({
          status: 500,
          message: "Internal Server Error - Check Server logs",
        });
    }
  },
  verifyCode: async (req: Request, res: Response) => {
    try {
      const { verificationCodeRequest } = req.body;
      const token = req.cookies.VerificationToken;
      const decoded = jwt.verify(token, config.jwt.secret) as MyTokenPayload;
      const { email, verificationCode: storedCode } = decoded;
      if (verificationCodeRequest !== storedCode) {
        return res.status(400).json({ message: "Invalid Code" });
      }
      const employee = await employeeModel.findOne({ email });
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });
      employee.isVerified = true;
      await employee.save();
      res.clearCookie("VerificationToken");
      res.json({ message: "Email verified successfuly" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error - Check Server Logs" });
    }
  },
  deleteEmployee: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({ status: 400, message: "Bad Request - Id is null" });
      const result = await employeeModel.findByIdAndDelete(id);
      if (!result)
        return res
          .status(409)
          .json({
            status: 409,
            message: "Can't delete employee - conflict check server logs",
          });
      return res
        .status(204)
        .json({ status: 204, message: "employee delete success", data: true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error - Check Server Logs" });
    }
  },
};

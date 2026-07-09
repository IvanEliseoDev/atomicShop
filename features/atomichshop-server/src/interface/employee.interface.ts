import { Types } from "mongoose";

export interface IEmployee {
    _id?: Types.ObjectId;
    name: string;
    number_phone?: string;
    direction?: string;
    position: string;
    payroll_month: string;
    email: string;
    password?: string;
    isGenericPassword: boolean;
    isVerified: boolean;
    loginAttemps?: number;
    timeOut?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateEmployeeInput = Omit<
    IEmployee,
    "_id" | "password" | "isGenericPassword" | "isVerified" | "loginAttemps" | "timeOut" | "payroll_month" | "createdAt" | "updatedAt"
>;

export type UpdateEmployeeInput = Partial<Omit<CreateEmployeeInput, "payroll_month">>;

export interface MyTokenPayload {
    email: string;
    verificationCode: string;
}

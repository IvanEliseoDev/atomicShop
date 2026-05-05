import { Types } from "mongoose";
export interface IEmployee {
    _id?: Types.ObjectId;
    name: string;
    dui: string;
    birthDay: Date;
    number_phone?: string;
    afp_affiliated?: string;
    isss?: string;
    dui_img?: string;
    direction?: string;
    position: string;
    payroll_month: string;
    salary: Types.Decimal128; 
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
    "_id" | "password" | "isGenericPassword" | "isVerified" | "loginAttemps" | "timeOut" | "createdAt" | "updatedAt"
>;

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export interface MyTokenPayload {
    email: string;
    verificationCode: string;
}
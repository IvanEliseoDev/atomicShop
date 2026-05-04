import { model, Schema, Types } from "mongoose";
import { IEmployee } from "../interface/employee.interface";

export const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dui: {
        type: String,
        required: true
    },
    birthDay: {
        type: Date,
        required: true
    },
    number_phone: {
        type: String
    },
    afp_affiliated: {
        type: String
    },
    isss: {
        type: String
    },
    dui_img: {
        type: String
    },
    direction: {
        type: String
    },
    position: {
        type: String,
        required: true
    },
    payroll_month: {
        type: String,
        required: true
    },
    salary: {
        type: Types.Decimal128,
        required: true,
        get: (v: Types.Decimal128) => v ? v.toString() : v
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: undefined
    },
    isGenericPassword: {
        type: String,
        default: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    loginAttemps: {
        type: Number
    },
    timeOut: {
        type: String
    }
},
{
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
    tls: {
        rejectUnauthorized: false // <--- ESTO SOLUCIONA EL ERROR DE CERTIFICADO
    }
})

export const employeeModel = model("Employees", employeeSchema)
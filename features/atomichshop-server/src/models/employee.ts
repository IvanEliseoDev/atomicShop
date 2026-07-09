import { model, Schema } from "mongoose";
import { IEmployee } from "../interface/employee.interface";

export const employeeSchema = new Schema<IEmployee>({
    name: {
        type: String,
        required: true
    },
    number_phone: {
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
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        default: undefined
    },
    isGenericPassword: {
        type: Boolean,
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
        type: Date
    }
},
{
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
})

export const employeeModel = model("Employees", employeeSchema)

import { model, Schema } from "mongoose";
import { ICustomer } from "../interface/customer.interface";

const customerSchema = new Schema<ICustomer>(
    {
        name: {
            type: String,
            required: true,       // "isRequired" no existe en Mongoose, el correcto es "required"
        },
        mail: {
            type: String,
            required: true,
        },
        password: {
            type: String,         // String || null no es valido en Mongoose, String solo es suficiente
            default: null,
        },
        telephone: {
            type: String,
        },
        direction: {
            type: String,
        },
        typeCustomer: {
            type: String,
        },
        dui: {
            type: String,
        },
        nit: {
            type: String,
        },
        typeActivity: {
            type: String,
        },
        state: {
            type: String,
        },
        loginAttemps: {
            type: Number,
            default: 0,
        },
        timeOut: {
            type: Date,           
            default: null,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export const customerModel = model<ICustomer>("Customers", customerSchema);

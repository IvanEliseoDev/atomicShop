import { model, Schema } from "mongoose";
import { ICustomer } from "../interface/customer.interface";

const customerSchema = new Schema<ICustomer>(
    {
        name: {
            type: String,
            isRequired: true,
        },
        mail:{
            type: String,
            isRequired: true
        },
        password:{
            type:String || null,
        },
        telephone:{
            type:String
        },
        direction:{
            type:String
        },
        dui: {
            type:String
        },
        state:{
            type: Boolean
        },
        loginAttemps: {
            type: Number
        },
        timeOut:{
            type: String
        }
    },
    {
        timestamps: true,
        strict: false,
    }
)

export const customerModel = model<ICustomer>("Customer", customerSchema)
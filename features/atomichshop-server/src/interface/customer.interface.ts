
import { Document, Types } from "mongoose";

export interface ICustomer extends Document {
    name: string
    mail: string
    password: string
    telephone: string,
    direction: string
    dui: string
    state: boolean
    isVerified: boolean
    loginAttemps: number
    timeOut: string
}
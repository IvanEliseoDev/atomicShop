
import { Document, Types } from "mongoose";

export interface ICustomer extends Document {
    name: string
    mail: string
    password: string
    telephone: string,
    direction: string
    dui: string
    nit: string,
    state: 'frecuente' | 'comun' | 'restringido'
    isVerified: boolean
    loginAttemps: number
    timeOut: string
}
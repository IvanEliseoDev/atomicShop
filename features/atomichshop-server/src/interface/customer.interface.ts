import { Document } from "mongoose";

export interface ICustomer extends Document {
    name: string;
    mail: string;
    password: string | null;
    telephone: string;
    direction: string;
    typeCustomer: string;
    dui: string;
    nit: string;
    typeActivity: string;
    state: string;
    loginAttemps: number;
    timeOut: Date | null;
}
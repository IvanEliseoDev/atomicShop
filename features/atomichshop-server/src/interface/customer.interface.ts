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
    image?: string; //El "?" sirve para indicarnos que estos campos pueden ser opcionales, un cliente puede agregar una imagen y a la vez no, por eso es un campo opcional
    public_id?: string;
    wishlist?: string[]; 
}
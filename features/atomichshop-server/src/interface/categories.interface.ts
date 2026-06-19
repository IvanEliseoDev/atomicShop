import { Document } from "mongoose";

export interface ICategorie extends Document {
    name: string;
    state: boolean;
}
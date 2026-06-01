import { model, Schema } from "mongoose";
import { ICategory } from "../interface/category.interface";

const categorySchema = new Schema<ICategory>({
     name: {
        type: String
     },
     state: {
        type: String
     }
    },
    {
        timestamps: true,
        strict: false,
    }
)

export const categoryModel = model<ICategory>("categories", categorySchema)
// ruta: ../src/models/providers.ts

// Ponemos los nombres de los campos que recibiremos de la tabla de productos para que cuando vallamos a hacer el controlador no noscueste utilizarlos y solo los venimos a copiar
/**
 * imgProvider
 * direction
 * mail
 * telephone
 * name
 */

// Como haremos una API con TypeScript, la forma de hacer el model y en general la API es algo diferente pero la misma logica pedorra de simpre 😈😈😈
import mongoose, { Schema, model, Document, Types } from "mongoose";

// VERSION DE ARCHIVO TS
// Interface que define la estructura del documento
export interface IProduct extends Document {
  imgProvider: string[];
  direction: string;
  mail: string;
  telephone: string;
  name: string;
}

// Ahora hacemos lo mismo que haciamos con la version de antes eso no cambia, pero si esto new Schema, ya que ahora hay que ponerle  new Schema<IProduct>
const productsSchema = new Schema<IProduct>(
  {
    imgProvider: { type: [String] }, // ✅ Corregido: Array tipado
    direction: { type: String },
    mail: { type: String },
    telephone: {type: String},
    name: { type: String },
  },
  {
    timestamps: true,
    strict: false,
  },
);

// Exportamos el model pero con la unica diferencia que ahora le ponemos esto <IProduct>
export default model<IProduct>("providers", productsSchema);
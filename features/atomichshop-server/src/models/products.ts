// ruta: ../src/models/products.ts

// Ponemos los nombres de los campos que recibiremos de la tabla de productos para que cuando vallamos a hacer el controlador no noscueste utilizarlos y solo los venimos a copiar
/**
 * code
 * brandId
 * categoryId
 * providerId
 * name
 * description
 * images
 * stock
 * price
 * discount
 * state
 */

// Como haremos una API con TypeScript, la forma de hacer el model y en general la API es algo diferente pero la misma logica pedorra de simpre 😈😈😈
import mongoose, { Schema, model, Document, Types } from "mongoose";

// VERSION DE ARCHIVO TS
// Interface que define la estructura del documento
export interface IProduct extends Document {
  code: string;
  brandId: Types.ObjectId;
  categoryId: Types.ObjectId;
  providerId: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  stock: number;
  price: number;
  discount: number;
  state: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Ahora hacemos lo mismo que haciamos con la version de antes eso no cambia, pero si esto new Schema, ya que ahora hay que ponerle  new Schema<IProduct>
const productsSchema = new Schema<IProduct>(
  {
    code: { type: String },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Providers",
    },
    name: { type: String },
    description: { type: String },
    images: { type: [String] }, // ✅ Corregido: Array tipado
    stock: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    state: { type: Boolean },
  },
  {
    timestamps: true,
    strict: false,
  },
);

// Exportamos el model pero con la unica diferencia que ahora le ponemos esto <IProduct>
export default model<IProduct>("Products", productsSchema);

// VERSION DE ARCHIVO JS
// // Si no existe esta coleccion en la bd, entonces me lo crea, es decir, no es necesario para nada crear las colecciones o la base antes de comenzar a hacer el proyecto, si no que de un solo a programar a lo baron
// // Schema: Sigue este esquema
// const productsSchema = new Schema(
//   {
//     code: {
//       type: String,
//     },
//     brandId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Brands", // Referenciamos al modelo en donde vamos a referenciar
//     },
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Categories",
//     },
//     providerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Providers",
//     },
//     name: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     images: {
//       type: Array,
//     },
//     stock: {
//       type: Number,
//     },
//     price: {
//       type: Number,
//     },
//     discount: {
//       type: Number,
//     },
//     state: {
//       type: Boolean,
//     },
//   },
//   {
//     timestamps: true, // Para poner automaticamente a todos los campos la fecha de creacion y de actualizacion
//     strict: false, // Le quitamos lo restringido, por que esto biene por default true
//   },
// );

// export default model("Products", reviewSchema);

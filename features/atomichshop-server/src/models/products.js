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

import mongoose, { Schema, SchemaTypes, model } from "mongoose";

// Si no existe esta coleccion en la bd, entonces me lo crea, es decir, no es necesario para nada crear las colecciones o la base antes de comenzar a hacer el proyecto, si no que de un solo a programar a lo baron
// Schema: Sigue este esquema
const productsSchema = new Schema(
  {
    code: {
      type: String,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands", // Referenciamos al modelo en donde vamos a referenciar
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Providers",
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    state: {
      type: Boolean,
    },
  },
  {
    timestamps: true, // Para poner automaticamente a todos los campos la fecha de creacion y de actualizacion
    strict: false, // Le quitamos lo restringido, por que esto biene por default true
  },
);

export default model("Products", reviewSchema);

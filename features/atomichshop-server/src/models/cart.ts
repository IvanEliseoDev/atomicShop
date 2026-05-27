import mongoose, { Schema, model } from "mongoose";

// Interfaz para el detalle de productos dentro del carrito
interface ICartProduct {
  idProduct: mongoose.Types.ObjectId;
  amount: number;
}

// Interfaz principal del Carrito
interface ICart {
  clientId: mongoose.Types.ObjectId;
  products: ICartProduct[];
  total: number;
  disccount: number;
  totalWithDiscount: number;
}

const cartSchema = new Schema<ICart>(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      required: true,
    },
    products: [
      {
        idProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    disccount: {
      type: Number,
      default: 0,
    },
    totalWithDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const modelCarts = model<ICart>("Carts", cartSchema);
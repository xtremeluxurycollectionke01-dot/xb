import mongoose, { Schema, model, models } from "mongoose";

const prroductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Prroduct = models.Product || model("Prroduct", prroductSchema);

export default Prroduct;
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 1,
    },

    images: [
      {
        type: String, // URL strings (Cloudinary later)
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

  },
  
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
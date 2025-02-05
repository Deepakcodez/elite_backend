import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Painter", 
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    productImage: {
      type: String, // Path or URL for the uploaded product image
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String, // e.g., "kg", "liters", "pieces", etc.
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number, // Optional
      default: null,
    },
    inStock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    rating : {
        type: Number,
        default: 0
    },
    numberOfUserRate : {
        type: Number,
        default: 0
    },
    price: {
        type: number,
        required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

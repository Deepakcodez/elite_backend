import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin","partner"],
      default: "user",
    },
    // will expand later
    address: {
      type: String,
      required: true,
    },
    
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

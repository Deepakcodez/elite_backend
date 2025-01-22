import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    businessName: { type: String }, // Optional
    gender: { type: String, enum: ["Male", "Female", "Other"] }, // Optional
    phoneNumber: { type: String }, // Optional
  },
  { timestamps: true }
);

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
                
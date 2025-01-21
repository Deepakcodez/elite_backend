import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fathersName: { type: String, required: true },
    dob: { type: Date, required: true },
    primaryMobile: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    secondaryMobile: { type: String },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    languages: [{ type: String }],
    profilePicture: { type: String }, // need to fix according to cloudinary
    referralCode: { type: String },
    role: {
      type: String,
      default: "Partner",
      enum: ["Partner", "User", "Admin"],
    },
    isVerified: { type: Boolean, default: false }, // will set by admin
    serviceCategory: {
      ref: "Category",
      type: mongoose.Schema.Types.ObjectId,
    },

    partnerDocuments: {
      ref: "Document",
      type: mongoose.Schema.Types.ObjectId,
    },
    bankDetails: {
      ref: "BankDetail",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);

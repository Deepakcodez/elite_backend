import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      // required: true
    },
    businessName: {
      type: String,
    },
    fathersName: {
      type: String,
      // required: true
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    otp: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dob: {
      type: Date,
      // required: true
    },
    primaryMobile: {
      type: String,
      // required: true
    },
    whatsappNumber: {
      type: String,
      // required: true
    },
    secondaryMobile: {
      type: String,
    },
    bloodGroup: {
      type: String,
      // required: true
    },
    city: {
      type: String,
      // required: true
    },
    address: {
      type: String,
      // required: true
    },
    languages: [
      {
        type: String,
      },
    ],
    profilePicture: {
      type: String, // need to fix according to cloudinary
    },
    referralCode: {
      type: String,
    },
    role: {
      type: String,
      default: "Partner",
      enum: ["Partner", "User", "Admin"],
    },
    isVerified: {
      // will set by admin
      type: Boolean,
      default: false,
    },
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
    walletBalance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);

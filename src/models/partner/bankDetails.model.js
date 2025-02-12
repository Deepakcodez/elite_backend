import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BankDetail", bankDetailsSchema);

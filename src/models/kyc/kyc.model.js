import mongoose  from "mongoose";

const kycSchema = new mongoose.Schema({
  influencerDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  nameOnDocument: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
//   documentNumber: {
//     type: String,
//     required: true,
//   },
  frontImage: {
    type: String,
    required: true,
  },
  backImage: {
    type: String,
    
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Cancel"],
    default: "Pending",
  },
  rejectionReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default  mongoose.model("KYC", kycSchema);
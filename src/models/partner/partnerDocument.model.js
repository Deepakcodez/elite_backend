import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    aadhaarCard: {
      type: String,
      required: true,
    }, // todo set to handle images
    panCard: {
      type: String,
      required: true,
    }, //  todo set to handle images
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentsSchema);

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    painterId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", required: true },
    customerName: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    items: { type: Number, required: true }, // Number of items in the order
    status: {
      type: String,
      enum: ["New Order", "Awaiting Orders", "In Transit", "Completed", "Cancelled"],
      default: "New Order",
    },
    date: { type: Date, default: Date.now },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

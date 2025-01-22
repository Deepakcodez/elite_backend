import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    painterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,

    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    typeOfProperty: {
      type: String,
      enum: ["home", "office", "villa"],
      required: true,
    },
    numberOfUnits: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfBedrooms: {
      type: Number,
      required: true,
      default: 0,
    },
    description : {
      type: String,
      required : false,
    },
    customer: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: [
        "New Order",
        "Awaiting Orders",
        "In Transit",
        "Completed",
        "Cancelled",
      ],
      default: "New Order",
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;

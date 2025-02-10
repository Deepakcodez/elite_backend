import Booking from "../models/booking/booking.model.js";
import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const calculatePrice = (typeOfProperty, numberOfUnits, numberOfBedrooms) => {
  let basePrice = 0;

  // Define base prices based on the type of property
  switch (typeOfProperty) {
    case "office":
      basePrice = 200;
      break;
    case "villa":
      basePrice = 150;
      break;
    case "home":
      basePrice = 300;
      break;
    default:
      basePrice = 100; // Default base price for unknown types
  }

  // Adjust price based on the number of units and bedrooms
  const pricePerUnit = 50; // Additional price per unit
  const pricePerBedroom = 30; // Additional price per bedroom

  const totalPrice =
    basePrice +
    numberOfUnits * pricePerUnit +
    numberOfBedrooms * pricePerBedroom;

  return totalPrice;
};

const generateOrderId = () => {
  const length = 6; // Length of the order ID
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Allowed characters
  const charactersLength = characters.length;

  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);
  let orderId = "";

  // Convert random bytes to alphanumeric characters
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charactersLength; // Ensure the index is within bounds
    orderId += characters[randomIndex];
  }

  return orderId;
};

// Create a new booking
const createBooking = async (req, res) => {
  const userId = req?.user._id;

  try {
    const {
      // painterId,
      typeOfProperty,
      numberOfUnits,
      numberOfBedrooms,
      description,
      status,
      date,
      time,
    } = req.body;

    if (!numberOfUnits || !numberOfBedrooms || !description || !time) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const price = calculatePrice(
      typeOfProperty,
      numberOfUnits,
      numberOfBedrooms
    );
    const orderId = generateOrderId();

    if (!price && !orderId) {
      throw new ApiError(
        404,
        "somethin went wrong in genrating orderId or price"
      );
    }

    const newBooking = new Booking({
      // painterId,
      typeOfProperty,
      numberOfBedrooms,
      numberOfUnits,
      description,
      date,
      status,
      time,
      orderId,
      price,
      customer: userId,
    });
    await newBooking.save();
    // Populate the 'customer' field with user details
    const detailedOfBooking = await Booking.findById(newBooking._id).populate({
      path: "customer",
      select: "-password -emailOtp -createdAt -updatedAt -__v",
    });

    res.status(201).json({
      msg: "Booking created successfully.",
      booking: detailedOfBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating booking.", details: error.message });
  }
};

// Get all bookings (Filtered by status if query is provided)
const getBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const query = status ? { status } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching bookings.", details: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      ![
        "New Order",
        "Awaiting Orders",
        "In Transit",
        "Completed",
        "Cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res
      .status(200)
      .json({ msg: "Booking status updated successfully.", booking });
  } catch (error) {
    res.status(500).json({
      error: "Error updating booking status.",
      details: error.message,
    });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching booking.", details: error.message });
  }
};

const getBookingsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  //  for error
  if (!status) return res.status(400).json(ApiError(400, "status is required"));

  const bookings = await Booking.find({ status });

  if (!bookings)
    return res.status(404).json(ApiError(404, "Bookings not found"));

  //  for success
  return res
    .status(200)
    .json(ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export {
  getBookingById,
  getBookings,
  createBooking,
  updateBookingStatus,
  getBookingsByStatus,
};

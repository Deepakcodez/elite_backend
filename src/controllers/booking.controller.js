import Booking from "../models/booking/booking.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { painterId, customerName, orderId, items, time } = req.body;

    if (!painterId || !customerName || !orderId || !items || !time) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newBooking = new Booking({ painterId, customerName, orderId, items, time });
    await newBooking.save();

    res.status(201).json({ msg: "Booking created successfully.", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Error creating booking.", details: error.message });
  }
};

// Get all bookings (Filtered by status if query is provided)
export const getBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const query = status ? { status } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings.", details: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New Order", "Awaiting Orders", "In Transit", "Completed", "Cancelled"].includes(status)) {
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

    res.status(200).json({ msg: "Booking status updated successfully.", booking });
  } catch (error) {
    res.status(500).json({ error: "Error updating booking status.", details: error.message });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ error: "Error fetching booking.", details: error.message });
  }
};

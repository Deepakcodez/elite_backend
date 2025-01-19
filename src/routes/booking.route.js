import express from "express";
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  getBookingById,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/bookings", createBooking);

// Get all bookings (or filtered by status)
router.get("/bookings", getBookings);

// Update booking status
router.put("/bookings/:id/status", updateBookingStatus);

// Get a single booking by ID
router.get("/bookings/:id", getBookingById);

export default router;

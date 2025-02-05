import express from "express";
import { createBooking, getBookingById, getBookings, updateBookingStatus } from "../controllers/booking.controller.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Create a new booking
router.post("/create", protect("user") ,createBooking);

// Get all bookings (or filtered by status)
router.get("/all", authorizeRoles("partner"), getBookings);

// // Update booking status
router.put("/bookings/:id/status", updateBookingStatus);

// // Get a single booking by ID
router.get("/bookings/:id", getBookingById);

export default router;

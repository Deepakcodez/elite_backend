import express from "express";
import {
  changePassword,
  createProfile,
  getEarnings,
  getProfile,
  login,
  register,
  saveLocation,
  sendOtpForLogin,
  signOut,
  updateAvailability,
  updateProfile,
  verifyLoginOTP,
  // verifyRegisterOTP,
} from "../controllers/parnter.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { getBookingById, getBookings, getBookingsBySearch, getBookingsByStatus, updateBookingStatus } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/send-otp", sendOtpForLogin);
router.post("/login/verify/otp", verifyLoginOTP);
router.post("/signout", signOut);
router.post("/change/password", protect("partner"), changePassword);
router.post("/save/location", protect("partner"), saveLocation);


//bookings routes
router.get("/bookings", protect("partner"), getBookings);
router.get("/bookings/:id", protect("partner"), getBookingById);
router.get("/bookings/status/:status", protect("partner"), getBookingsByStatus);
router.put("/bookings/:id/status", protect("partner"), updateBookingStatus);
router.get("/bookings/:category/:search", protect("partner"), getBookingsBySearch);

// router.post("/verifyRegisterOtp", verifyRegisterOTP);

router.post("/profile", createProfile);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/earnings/:id", getEarnings);
router.put("/availability/:id", updateAvailability);

export default router;
  
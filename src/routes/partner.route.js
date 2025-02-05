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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/send-otp", sendOtpForLogin);
router.post("/login/verify/otp", verifyLoginOTP);
router.post("/signout", signOut);
router.post("/change/password", protect("partner"), changePassword);
router.post("/save/location", protect("partner"), saveLocation);

// router.post("/verifyRegisterOtp", verifyRegisterOTP);

router.post("/profile", createProfile);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/earnings/:id", getEarnings);
router.put("/availability/:id", updateAvailability);

export default router;

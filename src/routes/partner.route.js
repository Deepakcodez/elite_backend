import express from "express";
import {
  createProfile,
  getEarnings,
  getProfile,
  login,
  register,
  sendOtpOnEmailForLogin,
  sendOtpOnPhoneForLogin,
  signOut,
  updateAvailability,
  updateProfile,
  verifyLoginOTP,
  verifyRegisterOTP,
} from "../controllers/parnter.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/mobile/send-otp", sendOtpOnPhoneForLogin);
router.post("/login/verify/otp", verifyLoginOTP);
router.post("/login/email/send-otp", sendOtpOnEmailForLogin);
router.post("/verifyRegisterOtp", verifyRegisterOTP);
router.post("/signout", signOut);

router.post("/profile", createProfile);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/earnings/:id", getEarnings);
router.put("/availability/:id", updateAvailability);

export default router;
  
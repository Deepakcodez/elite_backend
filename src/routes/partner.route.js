import express from "express";
import {
  createProfile,
  getEarnings,
  getProfile,
  login,
  register,
  signOut,
  updateAvailability,
  updateProfile,
  verifyLoginOTP,
  verifyRegisterOTP,
} from "../controllers/parnter.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verifyRegisterOtp", verifyRegisterOTP);
router.post("/verifyLoginOtp", verifyLoginOTP);
router.post("/signout", signOut);

router.post("/profile", createProfile);
router.get("/profile/:id", getProfile);
router.put("/profile/:id", updateProfile);
router.get("/earnings/:id", getEarnings);
router.put("/availability/:id", updateAvailability);

export default router;

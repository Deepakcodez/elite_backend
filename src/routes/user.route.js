import express from "express";
import {
    signup,
    login,
    logout,
    loginWithEmailOtp,
    verifyEmailOtpLogin,
    sendVerificationLink,
    verifyLink,
    resetPassword,
} from "../controllers/user.controller.js"; 

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Login with Email OTP
router.post("/login-otp", loginWithEmailOtp);

// Verify Email OTP
router.post("/verify-otp", verifyEmailOtpLogin);

// Send Verification Link for Password Reset
router.post("/send-verification-link", sendVerificationLink);

// Verify the Token in the Password Reset Link
router.get("/verify-link/:token", verifyLink);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;

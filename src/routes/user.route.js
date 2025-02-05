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
    changePassword,
    loginWithMobileOtp
} from "../controllers/user.controller.js";
import  {protect}  from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Route for logging in with mobile OTP
router.post("/login/otp", loginWithMobileOtp);

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
router.post("/reset-password",  resetPassword);

// change password
router.post("/change-password", protect("user"), changePassword);

export default router;

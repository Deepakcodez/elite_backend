import User from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import generateOtp from '../utils/generateOtp.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler.js"
import nodemailer from "nodemailer";
import crypto from "crypto";
import { ApiError } from "../utils/apiError.js";

// Mock OTP
const MOCK_OTP = "9876";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: "Name, email or phone, and password are required" });
    }

    // Check if the user already exists (either by email or phone)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password, // Password will be hashed by the pre-save middleware
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error); // Debugging
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Login Controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is set for the user
    if (!user.password) {
      return res.status(401).json({ message: "Password not set for this user" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success response
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error); // Debugging
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Login via Email OTP
export const loginWithEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "Email not exist");
    }

    // Generate a 6-digit OTP
    const emailOtp = generateOtp();

    // Save the OTP to the user's record (insecure if not hashed; consider hashing OTP in production)
    user.emailOtp = emailOtp;
    await user.save();
    // Send the OTP via email
    await sendEmail(email, 'Your Login OTP', `Your OTP is: ${emailOtp}`);
    console.log('OTP sent to email:', email);

    // Generate JWT token
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Store the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side access to the cookie
      // eslint-disable-next-line no-undef
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with a success message
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error during login with email OTP:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Verify Email OTP
export const verifyEmailOtpLogin = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if the user exists and OTP matches
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Clear the OTP after successful verification
    user.emailOtp = null;
    await user.save();

    // Generate a JWT token
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send success response
    res.status(200).json({
      message: 'OTP verified successfully 🎉. User logged in successfully.',
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
};

// Controller for mobile OTP login

export const loginWithMobileOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // Validate input
    if (!phone && !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required." });
    }

    // Check if the user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate OTP
    if (otp !== MOCK_OTP) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during OTP login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};
// Send Verification Link
export const sendVerificationLink = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.emailOtp = token;
    await user.save();

    const verificationUrl = `http://localhost:5000/api/auth/VerifyLink-password/${token}`;

    await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        // eslint-disable-next-line no-undef
        user: process.env.EMAIL_USER,
        // eslint-disable-next-line no-undef
        pass: process.env.EMAIL_PASS,
      },
    }).sendMail({
      // eslint-disable-next-line no-undef
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    res.status(200).json({ message: 'Verification link sent to your email.' });
  } catch (error) {
    next(error);
  }
};

// verify link
export const verifyLink = async (req, res, next) => {
  const { token } = req.params;


  try {
    const user = await User.findOne({ emailOtp: token });
    if (!user || (user.otpExpiresAt && user.otpExpiresAt < Date.now())) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    res.status(200).json({ message: 'Token verified. You can reset your password.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    // Decode the token to extract user ID or email
      // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find the user using the decoded information
    const user = await User.findById(decoded.id); // Assuming `id` is in the token payload
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.otpExpiresAt && user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Token is expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.emailOtp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully reset. You can now log in with the new password." });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token is expired." });
    }
    next(error);
  }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required." });
  }

  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if the current password matches the one in the database
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed new password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Your password has been successfully changed. You can now use your new password to log in.",
    });
  } catch (error) {
    next(error);
  }
};
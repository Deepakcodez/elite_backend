import User from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import  generateOtp  from '../utils/generateOtp.js';
import sendEmail  from '../utils/sendEmail.js';
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/errorHandler.js"
import nodemailer from "nodemailer";
import crypto from "crypto";



// Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ message: "Name, email or phone, and password are required" });
    }

    // Check if the user already exists (either by email or phone)
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or phone already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email: email || null, // If email is not provided, set it to null
      phone: phone || null, // If phone is not provided, set it to null
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
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
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate a token
      // eslint-disable-next-line no-undef
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
  
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
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
        // If user does not exist, create a new user
        user = new User({ email });
        await user.save();
        console.log('New user created:', user);
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
    }
};

// logout
export const logout = async (req, res) => {
    try {
      res.clearCookie('token', { path: '/' });
      res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging out', error: error.message });
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
  
  // Reset Password
export const resetPassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body; 
  
    try {
      const user = await User.findById(req.user.id).select("+password");
      
  
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      // Check if the current password matches the one in the database
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password); 
  
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect current password", 401));
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
      console.error(error);
      return next(error);
    }
};
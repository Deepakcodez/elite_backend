import User from '../models/user/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import  KYC  from "../models/kyc/kyc.model.js";
import  Partner  from "../models/partner/partner.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



// Admin Registration Controller
export const adminRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return next(new ErrorHandler('All fields are required', 400));
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('Email is already registered', 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with the role explicitly set to "admin"
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Explicitly set the role as admin
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login Controller
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return next(new ErrorHandler('Email and password are required', 400));
    }

    // Find the user in the database
    const admin = await User.findOne({ email });

    // Check if the user exists and is an admin
    if (!admin || admin.role !== 'admin') {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Generate a JWT token
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      // eslint-disable-next-line no-undef
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Logout Controller
export const adminLogout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully',
  });
};


// Controller to get a user by ID (admin only)
export const getUser = async (req, res, next) => {
  try {
    const user = req.user; // The user is already attached by the 'protect' middleware
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to create a new user (admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return next(new ErrorHandler('Admin privileges required', 403));
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete a user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return next(new ErrorHandler('Admin privileges required', 403));
    }

    // Find and delete the user
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return next(new ErrorHandler('User not found', 404));
    }

    await userToDelete.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch all users (admin only)
export const getAllUser = async (req, res, next) => {
  try {
    // Fetch all users excluding passwords
    const users = await User.find().select('-password');
    
    if (!users) {
      return next(new ErrorHandler('No users found', 404));
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


// Update KYC Details
export const updateKyc = async (req, res, next) => {
  try {
    const { PartnerId } = req.params;
    const { kycDocId, isVerified, rejectionReason } = req.body;

    const kycEntry = await KYC.findById(kycDocId);
    if (!kycEntry) {
      return res.status(404).json({
        success: false,
        message: "KYC entry not found.",
      });
    }

    if (isVerified) {
      kycEntry.status = "Verified";
      kycEntry.rejectionReason = null;
      await kycEntry.save();

      await Partner.findByIdAndUpdate(
        PartnerId,
        { isKycVerified: true },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "KYC has been verified successfully.",
      });
    } else {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required when rejecting KYC.",
        });
      }

      kycEntry.status = "Cancel";
      kycEntry.rejectionReason = rejectionReason;
      await kycEntry.save();

      await Partner.findByIdAndUpdate(
        PartnerId,
        { isKycVerified: false },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "KYC has been rejected.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get Pending KYC
export const getPendingKyc = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const result = await KYC.aggregate([
      {
        $facet: {
          totalPendingKyc: [
            { $match: { status: "Pending" } },
            { $count: "count" },
          ],
          kycs: [
            { $match: { status: "Pending" } },
            {
              $lookup: {
                from: "partners",
                localField: "PartnerDocId",
                foreignField: "_id",
                as: "partnerDetails",
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "KYC pending partners",
      result,
    });
  } catch (error) {
    next(error);
  }
};




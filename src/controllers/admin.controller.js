import User from '../models/user/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';
import  KYC  from "../models/kyc/kyc.model.js";
import  Partner  from "../models/partner/partner.model.js";


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




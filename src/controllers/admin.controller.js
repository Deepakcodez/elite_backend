import User from '../models/user/user.model.js';
import ErrorHandler from '../utils/errorHandler.js';

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

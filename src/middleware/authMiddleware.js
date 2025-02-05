import jwt from 'jsonwebtoken';
import User from '../models/user/user.model.js';
import Partner from '../models/partner/partner.model.js';
import ErrorHandler from '../utils/errorHandler.js';

export const protect = (role) => {
  return async (req, res, next) => {
    let token;

    // Check if the token exists in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Extract the token from the header
        token = req.headers.authorization.split(' ')[1];

        // Verify the token
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user/partner/admin details based on the role
        let user;
        if (role === 'user') {
          user = await User.findById(decoded.id).select('-password');
          req.user = user; // Attach user to the request object
        } else if (role === 'partner') {
          user = await Partner.findById(decoded.userId).select('-password');
          req.partner = user; // Attach partner to the request object
        } else if (role === 'admin') {
          user = await User.findById(decoded.id).select('-password');
          if (!user || user.role !== 'admin') {
            throw new ErrorHandler('Admin privileges required', 403);
          }
          req.admin = user; // Attach admin to the request object
        }

        // If no user is found, throw an error
        if (!user) {
          throw new ErrorHandler(`${role.charAt(0).toUpperCase() + role.slice(1)} not found`, 404);
        }

        // Proceed to the next middleware
        next();
      } catch (error) {
        // Handle token verification errors
        res.status(401).json({
          message: 'Not authorized, token failed',
          error: error.message,
        });
      }
    } else {
      // Handle missing token
      res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  };
};

// Middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is allowed
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
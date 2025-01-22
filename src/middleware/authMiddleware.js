import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      //  !user  check partner model   than catch

      if (!req.user) throw new Error('User not found');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' , error});
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export default protect;
=======
import User from '../models/user/user.model.js';
import Partner from '../models/partner/partner.model.js';
import ErrorHandler from '../utils/errorHandler.js';

 export const protect = (role) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
          // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details based on the role
        let user;
        if (role === 'user') {
          user = await User.findById(decoded.id).select('-password');
        } else if (role === 'partner') {
          user = await Partner.findById(decoded.id).select('-password');
        } else if (role === 'admin') {
          user = await User.findById(decoded.id).select('-password');
          if (user && user.role !== 'admin') {
            throw new ErrorHandler('Admin privileges required', 403);
          }
        }

        // If no user is found, throw an error
        if (!user) {
          throw new ErrorHandler(`${role.charAt(0).toUpperCase() + role.slice(1)} not found`, 404);
        }

        // Attach the user, partner, or admin to the request object
        req[role] = user;
        next();
      } catch (error) {
        res.status(401).json({
          message: 'Not authorized, token failed',
          error: error.message,
        });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  };
};


// Middleware to authorize specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
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


>>>>>>> Shubham

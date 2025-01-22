import express from 'express';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getUser, createUser, deleteUser,getAllUser } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin-only routes
router.get('/user/:id', protect('admin'), authorizeRoles('admin'), getUser); // Admin to get user details
router.post('/user', protect('admin'), authorizeRoles('admin'), createUser); // Admin to create user
router.delete('/user/:id', protect('admin'), authorizeRoles('admin'), deleteUser); // Admin to delete user
router.get('/users', protect('admin'), authorizeRoles('admin'), getAllUser); // Admin to get all users

export default router;

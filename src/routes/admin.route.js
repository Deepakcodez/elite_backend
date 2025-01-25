import express from 'express';
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getUser, createUser, deleteUser,getAllUser } from "../controllers/admin.controller.js";
import { updateKyc,getPendingKyc } from '../controllers/admin.controller.js';

const router = express.Router();

// Admin-only routes
router.get('/user/:id', protect('admin'), authorizeRoles('admin'), getUser); // Admin to get user details
router.post('/user/new', protect('admin'), authorizeRoles('admin'), createUser); // Admin to create user
router.delete('/user/:id', protect('admin'), authorizeRoles('admin'),deleteUser); // Admin to delete user
router.get('/users', protect('admin'), authorizeRoles('admin'), getAllUser); // Admin to get all users


//KYC DETAILS
router.put( '/kyc/:PartnerId',protect('admin'), authorizeRoles('admin'),updateKyc); // Admin to update KYC details
router.get('/kyc/pending',protect('admin'),authorizeRoles('admin'), getPendingKyc); // Admin to get pending KYC details
  


export default router;

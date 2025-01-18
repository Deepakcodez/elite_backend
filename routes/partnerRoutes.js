import express from 'express';
import {
    register, 
    login, 
    verifyLoginOTP, 
    verifyRegisterOTP,
    signOut,
    createProfile,
    getProfile,
    updateProfile,
    getEarnings,
    updateAvailability,
} from '../controllers/partnerController.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verifyRegisterOtp', verifyRegisterOTP);
router.post('/verifyLoginOtp', verifyLoginOTP);
router.post("/signout", signOut);

router.post("/profile", createProfile); 
router.get("/profile/:id", getProfile); 
router.put("/profile/:id", updateProfile); 
router.get("/earnings/:id", getEarnings); 
router.put("/availability/:id", updateAvailability);


export default router;

import express from 'express';
import {
    addPersonalInfo,
    getPersonalInfo,
    updatePersonalInfo,
    deletePersonalInfo,
    addDocuments,
    getDocuments,
    updateDocuments,
    deleteDocuments,
    addBankDetails,
    getBankDetails,
    updateBankDetails,
    deleteBankDetails
} from '../controllers/profileController.js';

const router = express.Router();

// Personal Info Routes
router.post('/personal-info', addPersonalInfo); // Create
router.get('/personal-info/:id', getPersonalInfo); // Read
router.put('/personal-info/:id', updatePersonalInfo); // Update
router.delete('/personal-info/:id', deletePersonalInfo); // Delete

// Documents Routes
router.post('/documents', addDocuments); 
router.get('/documents/:id', getDocuments); // Read
router.put('/documents/:id', updateDocuments); // Update
router.delete('/documents/:id', deleteDocuments); // Delete

// Bank Details Routes
router.post('/bank-details', addBankDetails); // Create
router.get('/bank-details/:id', getBankDetails); // Read
router.put('/bank-details/:id', updateBankDetails); // Update
router.delete('/bank-details/:id', deleteBankDetails); // Delete

export default router;

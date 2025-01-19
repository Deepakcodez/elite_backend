import PersonalInfo from '../models/PersonalInfo.js';
import Documents from '../models/Documents.js';
import BankDetails from '../models/BankDetails.js';

// Step 1: Add personal information
export const addPersonalInfo = async (req, res) => {
    try {
        const personalInfo = new PersonalInfo(req.body);
        const savedInfo = await personalInfo.save();
        res.status(201).json(savedInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 1: Get personal information by ID
export const getPersonalInfo = async (req, res) => {
    try {
        const personalInfo = await PersonalInfo.findById(req.params.id);
        if (!personalInfo) {
            return res.status(404).json({ message: 'Personal information not found' });
        }
        res.status(200).json(personalInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 1: Update personal information by ID
export const updatePersonalInfo = async (req, res) => {
    try {
        const updatedInfo = await PersonalInfo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedInfo) {
            return res.status(404).json({ message: 'Personal information not found' });
        }
        res.status(200).json(updatedInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 1: Delete personal information by ID
export const deletePersonalInfo = async (req, res) => {
    try {
        const deletedInfo = await PersonalInfo.findByIdAndDelete(req.params.id);
        if (!deletedInfo) {
            return res.status(404).json({ message: 'Personal information not found' });
        }
        res.status(200).json({ message: 'Personal information deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 2: Add personal documents
export const addDocuments = async (req, res) => {
    try {
        const documents = new Documents(req.body);
        const savedDocs = await documents.save();
        res.status(201).json(savedDocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 2: Get personal documents by ID
export const getDocuments = async (req, res) => {
    try {
        const documents = await Documents.findById(req.params.id);
        if (!documents) {
            return res.status(404).json({ message: 'Documents not found' });
        }
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 2: Update personal documents by ID
export const updateDocuments = async (req, res) => {
    try {
        const updatedDocs = await Documents.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDocs) {
            return res.status(404).json({ message: 'Documents not found' });
        }
        res.status(200).json(updatedDocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 2: Delete personal documents by ID
export const deleteDocuments = async (req, res) => {
    try {
        const deletedDocs = await Documents.findByIdAndDelete(req.params.id);
        if (!deletedDocs) {
            return res.status(404).json({ message: 'Documents not found' });
        }
        res.status(200).json({ message: 'Documents deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 3: Add bank account details
export const addBankDetails = async (req, res) => {
    try {
        const bankDetails = new BankDetails(req.body);
        const savedDetails = await bankDetails.save();
        res.status(201).json(savedDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 3: Get bank account details by ID
export const getBankDetails = async (req, res) => {
    try {
        const bankDetails = await BankDetails.findById(req.params.id);
        if (!bankDetails) {
            return res.status(404).json({ message: 'Bank details not found' });
        }
        res.status(200).json(bankDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 3: Update bank account details by ID
export const updateBankDetails = async (req, res) => {
    try {
        const updatedDetails = await BankDetails.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDetails) {
            return res.status(404).json({ message: 'Bank details not found' });
        }
        res.status(200).json(updatedDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Step 3: Delete bank account details by ID
export const deleteBankDetails = async (req, res) => {
    try {
        const deletedDetails = await BankDetails.findByIdAndDelete(req.params.id);
        if (!deletedDetails) {
            return res.status(404).json({ message: 'Bank details not found' });
        }
        res.status(200).json({ message: 'Bank details deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

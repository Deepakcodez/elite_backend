import Document from "../models/partner/partnerDocument.model.js";
import ErrorHandler from "../utils/errorHandler.js";

// Post KYC Details
export const postKyc = async (req, res, next) => {
  try {
    const { aadhaarCard, panCard } = req.body;
    const userId = req.user.id;

    if (!aadhaarCard || !panCard) {
      return next(new ErrorHandler("Both Aadhaar Card and PAN Card are required", 400));
    }

    // Check if KYC already exists
    let existingDocument = await Document.findOne({ userId });
    if (existingDocument) {
      // Update existing document details
      existingDocument.aadhaarCard = aadhaarCard;
      existingDocument.panCard = panCard;

      await existingDocument.save();
      return res.status(200).json({
        success: true,
        message: "KYC details updated successfully",
      });
    }

    // Create a new document record
    const newDocument = await Document.create({
      userId,
      aadhaarCard,
      panCard,
    });

    return res.status(201).json({
      success: true,
      message: "KYC details submitted successfully",
      document: newDocument,
    });
  } catch (error) {
    next(error);
  }
};

// Get KYC Status
export const getKycStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const document = await Document.findOne({ userId }).sort({ createdAt: -1 });

    if (!document) {
      return next(new ErrorHandler("No KYC details found for this user", 400));
    }

    return res.status(200).json({
      success: true,
      message: "KYC details are available",
    });
  } catch (error) {
    next(error);
  }
};

// Get KYC Details
export const getKycDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const document = await Document.findOne({ userId }).sort({ createdAt: -1 });

    if (!document) {
      return next(new ErrorHandler("No KYC details found for this user", 400));
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

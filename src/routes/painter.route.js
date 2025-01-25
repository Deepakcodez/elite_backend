import express from "express";
import  {protect}  from "../middleware/authMiddleware.js"; 
import upload from "../middleware/uploadMiddleware.js";
import {
    addProduct,
    deleteProduct,
    addServiceRequest,
    getUserServiceRequests,
    getUserProducts,
} from "../controllers/Painter.controller.js";

const router = express.Router();
// Route to add a new product
router.post("/add-product", protect, upload.single("productImage"), addProduct);

// Route to get all products for the authenticated user
router.get("/my-products", protect, getUserProducts);

// Route to delete a product by ID
router.delete("/delete-product/:productId", protect, deleteProduct);

// Route to add a new service request
router.post("/add-service-request", protect, addServiceRequest);

// Route to get all service requests for the authenticated user
router.get("/my-service-requests", protect, getUserServiceRequests);

export default router;
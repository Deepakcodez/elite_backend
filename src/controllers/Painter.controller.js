import ServiceRequest from "../models/painter/PainterProfileModel.js";
import Product from "../models/painter/productModel.js"



// Add a new service request
export const addServiceRequest = async (req, res) => {
    try {
        // Extract form data from the request body
        const {
            name,
            professionalTitle,
            about,
            address,
            yearsOfExperience,
            certifications,
            skills,
            serviceArea,
            teamSize,
            availability,
            pricing,
            gallery,
        } = req.body;

        // Validate mandatory fields
        if (!name || !professionalTitle || !address || !pricing) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        // Create a new service request object
        const serviceRequest = new ServiceRequest({
            user: req.user._id, // Assuming the user is authenticated
            name,
            professionalTitle,
            about,
            address,
            yearsOfExperience,
            certifications,
            skills,
            serviceArea,
            teamSize,
            availability,
            pricing,
            gallery,
        });

        // Save to the database
        await serviceRequest.save();

        res.status(201).json({
            message: "Service request added successfully",
            serviceRequest,
        });
    } catch (error) {
        console.error("Error adding service request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all service requests for a user
export const getUserServiceRequests = async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find({ user: req.user._id });
        res.status(200).json(serviceRequests);
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a new product
export const addProduct = async (req, res) => {
    try {

        const {
            productName,
            description,
            category,
            unit,
            price,
            discountPrice,
            inStock,
        } = req.body;

        // Validate mandatory fields
        if (!productName || !category || !unit || !price) {
            return res.status(400).json({
                message: "Please fill in all required fields.",
            });
        }

        // Handle optional image upload
        const productImage = req.file ? req.file.path : null;

        // Create a new product object
        const product = new Product({
            user: req.user._id, // Assuming the user is authenticated
            productName,
            description,
            productImage,
            category,
            unit,
            price,
            discountPrice,
            inStock: inStock || false, // Default to false if not provided
        });

        // Save to the database
        await product.save();

        res.status(201).json({
            message: "Product added successfully.",
            product,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// Get all products for a user
export const getUserProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        // Check if the user owns the product
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You do not have permission to delete this product.",
            });
        }

        // Delete the product
        await product.remove();

        res.status(200).json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import servicesModel from "../models/services/services.model.js";
import categoryModel from "../models/category/category.model.js";

const createService = asyncHandler(async (req, res) => {
  const { title, description, category, price } = req.body;

  // Validate required fields
  if (!title?.trim() || !description?.trim() || !category || !price) {
    throw new ApiError(
      400,
      "Title, description, category, and price are required"
    );
  }

  // Check if the category exists (optional, if you want to validate the category)
  const existingCategory = await categoryModel.findById(category);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  // Check if the service title is unique
  const existingService = await servicesModel.findOne({ title });
  if (existingService) {
    throw new ApiError(409, "Service with this title already exists");
  }
  // Create the service
  const service = await servicesModel.create({
    title,
    description,
    category,
    price,
  });

  existingCategory.services.push(service._id);
  await existingCategory.save();
  // Return the created service
  return res
    .status(201)
    .json(new ApiResponse(201, service, "Service created successfully"));
});

const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id) {
    throw new ApiError(400, "Service ID is required");
  }

  // Find the service by ID
  const service = await servicesModel.findById(id);

  // Check if the service exists
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // Return the service
  return res
    .status(200)
    .json(new ApiResponse(200, service, "Service fetched successfully"));
});

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the service ID from the request parameters
  const { title, description, price } = req.body; // Get the updated data from the request body

  // Check if the service exists
  const existingService = await servicesModel.findById(id);
  if (!existingService) {
    throw new ApiError(404, "Service not found");
  }

  // Update title if provided
  if (title?.trim()) {
    // Check if the new title is unique (if it's being updated)
    if (title !== existingService.title) {
      const duplicateService = await servicesModel.findOne({ title });
      if (duplicateService) {
        throw new ApiError(409, "Service with this title already exists");
      }
    }
    existingService.title = title;
  }
  // Update description if provided
  if (description?.trim()) {
    existingService.description = description;
  }


  // Update price if provided
  if (price) {
    existingService.price = price;
  }

  // Save the updated service
  const updatedService = await existingService.save();
  // Return the updated service
  return res
    .status(200)
    .json(new ApiResponse(200, updatedService, "Service updated successfully"));
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the service ID from the request parameters
  
    // Check if the service exists
    const service = await servicesModel.findById(id);
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
  
    // Find the category associated with the service
    const category = await categoryModel.findById(service.category);
    if (category) {
      // Remove the service ID from the category's services array
      category.services.pull(id); // Corrected syntax
      await category.save(); // Save the updated category
    }
  
    // Delete the service
    await servicesModel.findByIdAndDelete(id);
  
    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Service deleted successfully"));
  });

export { createService, getServiceById, updateService, deleteService };

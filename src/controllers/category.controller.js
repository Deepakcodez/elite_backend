import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import categoryModel from "../models/category/category.model.js";

const demo = asyncHandler(async (req, res) => {
  const data = 12;
  //  for error
  if (data < 2) {
    throw new ApiError(404, "your error message");
  }
  //  for success
  return res.status(200).json(ApiResponse(200, data, "your message"));
});

const createCategory = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title.trim() || !description.trim()) {
    throw new ApiError(404, "provide title and description");
  }

  // Validation: Check if title is unique
  const existingCategory = await categoryModel.findOne({ title });
  if (existingCategory) {
    throw new ApiError(404, "category alraeady available");
  }

  const data = {
    title,
    description,
  };
  const category = await categoryModel.create(data);

  return res.status(200).json(new ApiResponse(200, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await categoryModel.find();

    // Check if categories exist
    if (!categories || categories.length === 0) {
      throw new ApiError(404, "not any category available");
    }

    // Return the categories
    return res
      .status(200)
      .json(new ApiResponse(200, categories, "Categories fetched successfully"));
  } catch (error) {
    console.log(error);
    // Handle database errors
    throw new ApiError(404, "failed to fetch category ");
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the category ID from the request parameters
  const { title, description } = req.body; // Get the updated data from the request body

  // Validate input
  if (!title?.trim() && !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  // Check if the category exists
  const existingCategory = await categoryModel.findById(id);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  // Update title if provided
  if (title?.trim()) {
    // Check if the new title is unique (if it's being updated)
    if (title !== existingCategory.title) {
      const duplicateCategory = await categoryModel.findOne({ title });
      if (duplicateCategory) {
        throw new ApiError(409, "Category with this title already exists");
      }
    }
    existingCategory.title = title;
  }

  // Update description if provided
  if (description?.trim()) {
    existingCategory.description = description;
  }
  const updatedCategory = await existingCategory.save();

  // Return the updated category
  return res
    .status(200)
    .json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the category ID from the request parameters

  // Check if the category exists
  const category = await categoryModel.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Delete the category
  await categoryModel.findByIdAndDelete(id);

  // Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});


export { demo, createCategory, getAllCategories, updateCategory , deleteCategory};

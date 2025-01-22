import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

<<<<<<< HEAD
router.get("/",   getAllCategories);
=======
router.get("/", getAllCategories);
>>>>>>> Shubham
router.post("/create", createCategory);
router.patch("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;

import express from "express";
import { createService, deleteService, getServiceById, updateService } from "../controllers/service.controller.js";


const router = express.Router();

router.post("/create", createService);
router.get("/:id", getServiceById);
router.patch("/update/:id", updateService);
router.delete("/delete/:id", deleteService);


export default router;

import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrand,
  updateBrand,
} from "../controllers/brandController.js";
const router = express.Router();

router.post("/brands", createBrand);
router.put("/brands/:id", updateBrand);
router.delete("/brands/:id", deleteBrand);
router.get("/get", getBrand);

export default router;

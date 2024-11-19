import express from "express";
import {
  createCategory,
  deleteCat,
  editCat,
  getAllMainCategory,
  getAllSubCategory,
  getCategory,
  getMainAndSubCategories,
  getPackages,
  getSingleCat,
} from "../controllers/categoryController.js";

const router = express.Router();
router.post("/create", createCategory);
router.get("/get", getCategory);
router.get("/get-main", getAllMainCategory);
router.delete("/delete/:id", deleteCat);
router.put("/update/:id", editCat);
router.get("/single-get/:updateId", getSingleCat);
router.post("/get-sub", getAllSubCategory);
router.get("/all-main-sub", getMainAndSubCategories);
router.get("/get-packages/:mainCat", getPackages);

export default router;

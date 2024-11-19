import express from "express";
import {
  deleteUser,
  getAllUser,
  logout,
  signIn,
  signUp,
  updateUserRole,
} from "../controllers/authController.js";
import { userDetails } from "../controllers/userDetails.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/logout", logout);
router.get("/user-details", userDetails);
router.get("/get/:id", getAllUser);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUserRole);

export default router;

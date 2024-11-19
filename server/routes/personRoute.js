import express from "express";
import {
  createPerson,
  deletePerson,
  getAllPerson,
  getPerson,
  updatePerson,
} from "../controllers/personController.js";

const router = express.Router();

router.post("/create", createPerson);
router.put("/update/:id", updatePerson);
router.delete("/delete/:id", deletePerson);
router.get("/:type", getPerson);
router.post("/get-all-person", getAllPerson);

export default router;

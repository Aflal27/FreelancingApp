import express from "express";
import {
  createThumbnail,
  deleteThumbnail,
  getThumb,
  updateThumbnail,
} from "../controllers/thumbnail.js";

const router = express.Router();
router.post("/thumbnails", createThumbnail);
router.put("/thumbnails/:id", updateThumbnail);
router.delete("/thumbnails/:id", deleteThumbnail);
router.get("/get", getThumb);

export default router;

import express from "express";
import {
  createGig,
  createReview,
  deleteGig,
  deleteReview,
  getAllGig,
  getFiveStarGigs,
  getReviews,
  getSingleGig,
  searchGigs,
  searchToGetGigs,
  updateGig,
  updateReview,
} from "../controllers/gigController.js";
const router = express.Router();

router.post("/create", createGig);
router.get("/get-all", getAllGig);
router.get("/get-single/:id", getSingleGig);
router.put("/update/:id", updateGig);
router.delete("/delete/:id", deleteGig);
router.get("/search-to-get-gigs/:searchData", searchToGetGigs);
router.post("/create-reviews/:gigId", createReview);
router.get("/get-reviews/:gigId", getReviews);
router.put("/update-reviews/:gigId/:reviewId", updateReview);
router.delete("/delete-reviews/:gigId/:reviewId", deleteReview);
router.get('/rating',getFiveStarGigs)
router.get('/search',searchGigs)

export default router;

import Gig from "../models/gigModel.js";

export const createGig = async (req, res, next) => {
  try {
    await Gig.create({
      ...req.body,
    });
    res.status(200).json("created gig successfully!");
  } catch (error) {
    next(error);
    console.log("createGigError", error);
  }
};

// get all gig
export const getAllGig = async (req, res, next) => {
  try {
    const data = await Gig.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
    console.log("get all gig", error);
  }
};

// get single gig
export const getSingleGig = async (req, res, next) => {
  try {
    const data = await Gig.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
    console.log("get single gig", error);
  }
};

//  update gig
export const updateGig = async (req, res, next) => {
  try {
    const data = await Gig.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
      },
    });
    res.status(200).json("update successfully!");
  } catch (error) {
    next(error);
    console.log("updateGig", error);
  }
};

// delete gig

export const deleteGig = async (req, res, next) => {
  try {
    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully!");
  } catch (error) {
    next(error);
    console.log("deleteGig", error);
  }
};

// client site

// search to get gigs
export const searchToGetGigs = async (req, res, next) => {
  try {
    if (!req.params.searchData) {
      return res.status(400).json({ message: "Search data is required" });
    }
    const data = await Gig.find({
      $or: [
        { mainCat: { $regex: req.params.searchData, $options: "i" } },
        { subCat: { $regex: req.params.searchData, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.log("searchToGetGigs", error);
    next(error);
  }
};

// Create a new review
export const createReview = async (req, res) => {
  const { gigId } = req.params;
  const { name, email, profilePic, rating, comment } = req.body;

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const newReview = { name, email, profilePic, rating, comment };
    gig.reviews.push(newReview);

    await gig.save();
    res.status(201).json(gig.reviews);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a review by review ID
export const updateReview = async (req, res) => {
  const { gigId, reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const review = gig.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await gig.save();
    res.status(200).json(gig.reviews);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a review by review ID
export const deleteReview = async (req, res) => {
  const { gigId, reviewId } = req.params;

  try {
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    gig.reviews = gig.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    await gig.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to get all reviews for a particular gig
export const getReviews = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    // Find the gig by ID and select only the reviews field
    const gig = await Gig.findById(gigId).select("reviews");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Respond with the reviews array
    res.status(200).json(gig.reviews);
  } catch (error) {
    console.error("getReviews error:", error);
    next(error);
  }
};

// Controller to fetch gigs with at least one 5-star rating, in increments of 6
export const getFiveStarGigs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  try {
    const fiveStarGigs = await Gig.find({ "reviews.rating": 5 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalFiveStarGigs = await Gig.countDocuments({ "reviews.rating": 5 });

    res.status(200).json({
      gigs: fiveStarGigs,
      hasMore: totalFiveStarGigs > page * limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching 5-star gigs", error });
  }
};

export const searchGigs = async (req, res) => {
  const { query } = req.query;

  try {
    // Perform a case-insensitive search on multiple fields
    const searchResults = await Gig.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { mainCat: { $regex: query, $options: "i" } },
        { subCat: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    // Return the matched gigs
    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ message: "Error performing search", error });
  }
};

import Category from "../models/CategoryModel.js";

export const createCategory = async (req, res, next) => {
  try {
    await Category.create({
      ...req.body,
    });
    res.status(200).json("created category successfully!");
  } catch (error) {
    next(error);
    console.log("categoryError", error);
  }
};

// get all cat
export const getCategory = async (req, res, next) => {
  try {
    const cat = await Category.find();
    res.status(200).json(cat);
  } catch (error) {
    next(error);
    console.log("getcategory", error);
  }
};

// delete cat
export const deleteCat = async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.status(400).json("somthing error!");
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted successfully!");
  } catch (error) {
    next(error);
    console.log("deleteGig", error);
  }
};

// edit cat
export const editCat = async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.status(200).json("updated successfully!");
  } catch (error) {
    next(error);
    console.log("deleteGig", error);
  }
};

// get single cat
export const getSingleCat = async (req, res, next) => {
  try {
    const data = await Category.find({ _id: req.params.updateId });
    res.status(200).json(data);
  } catch (error) {
    next(error);
    console.log("getSingleGig", error);
  }
};

// get all main cat
export const getAllMainCategory = async (req, res, next) => {
  try {
    const cat = await Category.find().select("main");
    res.status(200).json(cat);
  } catch (error) {
    next(error);
    console.log("getMainCategory", error);
  }
};

// get single sub cat
export const getAllSubCategory = async (req, res, next) => {
  try {
    let catSub;
    let catPack;
    const cat = await Category.find({
      main: req.body.mainCatData,
    }).select("sub packages");
    cat.map((c) => {
      catSub = c.sub;
      catPack = c.packages;
    });

    res.status(200).json({
      catPack,
      catSub,
    });
  } catch (error) {
    next(error);
    console.log("getSubCategory", error);
  }
};

// all main cat and sub cat
export const getMainAndSubCategories = async (req, res) => {
  try {
    // Fetch only the main and sub fields
    const categories = await Category.find().select("main sub logo");

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// get packages
export const getPackages = async (req, res, next) => {
  try {
    const data = await Category.find({
      main: { $regex: req.params.mainCat, $options: "i" },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};

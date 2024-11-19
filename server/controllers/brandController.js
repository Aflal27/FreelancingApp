import Brands from "../models/brandsModel.js";

export const getBrand = async (req, res) => {
  try {
    const brands = await Brands.find(); // Fetch all brands
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const createBrand = async (req, res) => {
  const { brandImage } = req.body; // Expecting brandImage array in request body

  try {
    const newBrand = new Brands({ brandImage }); // Create a new brand
    await newBrand.save(); // Save to the database
    res.status(201).json(newBrand);
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brandImage } = req.body; // Expecting updated brandImage array

  try {
    const updatedBrand = await Brands.findByIdAndUpdate(
      id,
      { brandImage },
      { new: true } // Return the updated document
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBrand = await Brands.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ message: "Server error" });
  }
};

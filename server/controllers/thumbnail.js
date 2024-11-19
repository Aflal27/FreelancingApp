import Thumbnail from "../models/thumbnailModal.js";

export const createThumbnail = async (req, res) => {
  const { thumbnail01, thumbnail02, thumbnail03 } = req.body; // Get data from the request body

  try {
    const newThumbnail = new Thumbnail({
      thumbnail01,
      thumbnail02,
      thumbnail03,
    });

    await newThumbnail.save(); // Save the new document to the database

    return res.status(201).json("create succcessfully!");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create thumbnail",
      error: error.message,
    });
  }
};

// Update an existing thumbnail document
export const updateThumbnail = async (req, res) => {
  const { id } = req.params; // Get the ID of the thumbnail to update
  const { thumbnail01, thumbnail02, thumbnail03 } = req.body; // Get new data from the request body

  try {
    const updatedThumbnail = await Thumbnail.findByIdAndUpdate(
      id,
      { thumbnail01, thumbnail02, thumbnail03 },
      { new: true } // Option to return the updated document
    );

    if (!updatedThumbnail) {
      return res.status(404).json({
        success: false,
        message: "Thumbnail not found",
      });
    }

    return res.status(200).json("updated successfully!");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update thumbnail",
      error: error.message,
    });
  }
};

// Delete a thumbnail document by ID
export const deleteThumbnail = async (req, res) => {
  const { id } = req.params; // Get the ID of the thumbnail to delete

  try {
    const deletedThumbnail = await Thumbnail.findByIdAndDelete(id);

    if (!deletedThumbnail) {
      return res.status(404).json({
        success: false,
        message: "Thumbnail not found",
      });
    }

    return res.status(200).json("Thumbnail deleted successfully");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete thumbnail",
      error: error.message,
    });
  }
};

export const getThumb = async (req, res, next) => {
  try {
    const thumbnails = await Thumbnail.findOne(); // Assuming you have a single record for thumbnails
    if (!thumbnails) {
      return res.status(404).json({ message: "No thumbnails found" });
    }
    res.json(thumbnails);
  } catch (error) {
    console.error("Error fetching thumbnails", error);
    res.status(500).json({ message: "Server error" });
  }
};

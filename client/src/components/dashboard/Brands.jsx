import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadFileCloud } from "../../helpers/uploadFileCloud";
import toast from "react-hot-toast";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [newBrandImages, setNewBrandImages] = useState([]);
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandImages, setEditBrandImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false); // State for loading image upload
  const [formData, setFormData] = useState({
    images: [], // Images array for new brand
  });

  // Fetch all brands when component loads
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brand/get");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  // Handle new brand image upload
  const handleImage = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    try {
      const upload = await uploadFileCloud(file); // Upload to cloud
      if (upload) {
        setFormData((prev) => ({
          ...prev,
          images: formData.images.concat(upload?.url), // Concatenate new image URL
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setImageLoading(false);
  };

  // Create a new brand
  const createBrand = async () => {
    try {
      const response = await axios.post("/api/brand/brands", {
        brandImage: formData.images, // Use the uploaded image URLs
      });
      setBrands([...brands, response.data]);
      toast.success("created successfully!");
      setNewBrandImages([]); // Clear input field
      setFormData({ images: [] }); // Clear form data after creation
    } catch (error) {
      console.error("Error creating brand:", error);
      toast.error("created error!");
    }
  };

  // Update a brand
  const updateBrand = async (id) => {
    try {
      const images = await uploadImages(editBrandImages); // Upload new images
      const response = await axios.put(`/api/brand/brands/${id}`, {
        brandImage: images,
      });
      setBrands(
        brands.map((brand) => (brand._id === id ? response.data : brand))
      );
      setEditBrandId(null); // Reset edit mode
      setEditBrandImages([]);
      toast.success("updated successfully!");
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("updated error!");
    }
  };

  // Delete a brand
  const deleteBrand = async (id) => {
    try {
      await axios.delete(`/api/brand/brands/${id}`);
      setBrands(brands.filter((brand) => brand._id !== id));
      toast.success("deleted successfully!");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("deleted error!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Brands</h1>

      {/* List of existing brands */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">All Brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div key={brand._id} className="bg-white p-4 shadow-md rounded-md">
              <div className="flex justify-center items-center space-x-2">
                {brand.brandImage.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="brand"
                    className="w-32 h-32 object-cover border rounded-md"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => deleteBrand(brand._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                  Delete
                </button>
                <button
                  onClick={() => setEditBrandId(brand._id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                  Edit
                </button>
              </div>
              {editBrandId === brand._id && (
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleImage}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    onClick={() => updateBrand(brand._id)}
                    className="bg-green-500 text-white py-1 px-3 mt-3 rounded-md hover:bg-green-600">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form to create a new brand */}
      <div className="bg-white p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>

        {/* Display image previews */}
        <div className="flex space-x-4 mb-4">
          {formData.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="preview"
              className="w-20 h-20 object-cover border rounded-md"
            />
          ))}
        </div>

        {/* Image upload for new brand */}
        <input
          type="file"
          onChange={handleImage}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />

        <button
          onClick={createBrand}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          disabled={imageLoading} // Disable button when uploading
        >
          {imageLoading ? "Uploading..." : "Add Brand"}
        </button>
      </div>
    </div>
  );
}

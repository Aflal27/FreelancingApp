import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  brandImage: [String],
});

const Brands = mongoose.model("Brands", brandSchema);
export default Brands;

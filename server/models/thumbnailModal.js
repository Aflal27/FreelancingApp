import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema(
  {
    thumbnail01: {
      type: String,
      default: "",
    },
    thumbnail02: {
      type: String,
      default: "",
    },
    thumbnail03: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);
export default Thumbnail;

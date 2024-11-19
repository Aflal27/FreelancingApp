import mongoose from "mongoose";

const catSchema = new mongoose.Schema(
  {
    main: {
      type: String,
      require: true,
    },
    sub: [String],
    images: [String],

    logo: {
      type: String,
      require: true,
    },
    packages: [
      {
        pack: {
          type: String,
        },
        option: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", catSchema);
export default Category;

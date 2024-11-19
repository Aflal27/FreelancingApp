import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mainCat: {
      type: String,
      required: true,
    },
    subCat: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    base: {
      title: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      delivery: { type: Number, required: true },
      packages: [
        {
          name: {
            type: String,
          },
          check: { type: Boolean, default: false },
          option: { type: String }, // For option types like "unlimited"
          number: { type: Number },
        },
      ], // Assuming packages is an array of strings
    },
    silver: {
      title: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      delivery: { type: Number, required: true },
      packages: [
        {
          name: {
            type: String,
          },
          check: { type: Boolean, default: false },
          option: { type: String }, // For option types like "unlimited"
          number: { type: Number },
        },
      ],
    },
    platinum: {
      title: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      delivery: { type: Number, required: true },
      packages: [
        {
          name: {
            type: String,
          },
          check: { type: Boolean, default: false },
          option: { type: String }, // For option types like "unlimited"
          number: { type: Number },
        },
      ],
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Store the URLs of uploaded images
      },
    ],
    videos: [
      {
        type: String, // Store the URLs of uploaded videos
      },
    ],
    extraPackage: [
      {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
        time: { type: Number },
      },
    ],
    reviews: [
      {
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        profilePic: {
          type: String,
        },

        rating: {
          type: Number,
          default: 0,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;

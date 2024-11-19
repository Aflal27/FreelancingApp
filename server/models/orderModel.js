import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order_id: {
      type: Number,
    },
    address: {
      type: String,
    },
    amount: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["processing", "ongoing", "completed"],
      default: "processing",
    },
    gig: {
      id: {
        type: String,
      },
      image: {
        type: String,
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      day: {
        type: Number,
      },
      price: {
        type: Number,
      },
      packages: {
        type: Array,
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

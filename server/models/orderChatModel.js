import mongoose from "mongoose";

const orderMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    deliveryUrl: {
      type: String,
      default: "",
    },
    revision: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const converSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "OrderMessage",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const OrderMessageModel = mongoose.model(
  "OrderMessage",
  orderMessageSchema
);
export const OrderConverModel = mongoose.model("OrderConver", converSchema);

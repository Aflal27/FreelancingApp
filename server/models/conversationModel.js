import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
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
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    offer: {
      id: {
        type: String,
      },
      title: {
        type: String,
      },
      image: {
        type: String,
      },
      description: {
        type: String,
      },
      delivery: {
        type: Number,
      },
      price: {
        type: Number,
      },
      packages: [String],
      expire: {
        type: Number,
      },
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    desc: {
      type: String,
    },
    title: {
      type: String,
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
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Message", messageSchema);
export const ConverModel = mongoose.model("Conver", converSchema);

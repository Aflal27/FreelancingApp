import express from "express";
import { Server } from "socket.io";
import http from "http";
import { getToken } from "../helpers/getUserDetails.js";
import User from "../models/userModel.js";
import { ConverModel, MessageModel } from "../models/conversationModel.js";
import {
  OrderConverModel,
  OrderMessageModel,
} from "../models/orderChatModel.js";
import { getConversation } from "../helpers/getConversation.js";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTENDURL,
    credentials: true,
  },
});
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;

  try {
    const user = await getToken(token); // Make sure you handle if token is invalid or expired
    if (!user) {
      console.log("Invalid token");
      return socket.disconnect();
    }

    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());
    io.emit("onlineUser", Array.from(onlineUser));

    // Handle message page request
    socket.on("messagePage", async (userId) => {
      try {
        console.log("userId", userId);
        const userData = await User.findById(userId);
        const payload = {
          _id: userData?._id,
          name: userData?.username,
          email: userData?.email,
          profile_pic: userData?.profile_pic,
          role: userData?.role,
          online: onlineUser.has(userId),
        };
        socket.emit("messageUser", payload);

        // Fetch previous messages
        const getConversationMessage = await ConverModel.findOne({
          $or: [
            { sender: user?._id, receiver: userId },
            { sender: userId, receiver: user?._id },
          ],
        })
          .populate("messages")
          .sort({ updateAt: -1 });

        socket.emit("message", getConversationMessage?.messages || []);
      } catch (error) {
        console.error("Error in messagePage:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });

    // Handle new messages
    socket.on("newMessage", async (data) => {
      try {
        console.log("newMessage", data);
        let conversation = await ConverModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        });

        if (!conversation) {
          conversation = await ConverModel.create({
            sender: data?.sender,
            receiver: data?.receiver,
          });
        }

        const message = await MessageModel.create({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoUrl: data?.videoUrl,
          fileUrl: data?.fileUrl,
          msgByUserId: data?.msgByUserId,
          offer: data?.offer,
          image: data?.image,
          price: data?.price,
          desc: data?.desc,
          title: data?.title,
          order: data?.order,
        });

        await ConverModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: message._id } }
        );

        const updatedConversation = await ConverModel.findOne({
          _id: conversation._id,
        }).populate("messages");

        io.to(data?.sender).emit(
          "message",
          updatedConversation?.messages || []
        );
        io.to(data?.receiver).emit(
          "message",
          updatedConversation?.messages || []
        );

        // Update conversation lists
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.receiver).emit("conversation", conversationReceiver);
      } catch (error) {
        console.error("Error in newMessage:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // sidebar
    socket.on("sidebar", async (currentUser) => {
      console.log("currentUser", currentUser);
      const conversation = await getConversation(currentUser);
      socket.emit("conversation", conversation);
    });

    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConverModel.findOne({
        $or: [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id },
        ],
      });
      const conversationMessageId = conversation?.messages || [];
      const updateMessage = await MessageModel.updateMany(
        { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
        { $set: { seen: true } }
      );
      const conversationSender = await getConversation(user?._id);
      const conversationReceiver = await getConversation(msgByUserId);
      if (user?.id) {
        io.to(user?._id.toString()).emit("conversation", conversationSender);
        io.to(msgByUserId).emit("conversation", conversationReceiver);
      }
    });

    // Handle single message delete
    socket.on("deleteMessage", async (messageId) => {
      try {
        // Find the message and remove it
        const message = await MessageModel.findByIdAndDelete(messageId);
        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        // Remove the message from the conversation
        await ConverModel.updateOne(
          { messages: messageId },
          { $pull: { messages: messageId } }
        );

        // Emit updated conversation
        const conversation = await ConverModel.findById(
          message.conversationId
        ).populate("messages");
        io.to(message.sender).emit("message", conversation?.messages || []);
        io.to(message.receiver).emit("message", conversation?.messages || []);
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    // handle order
    // Handle order message page request
    socket.on("orderMessagePage", async ({ id, orderId }) => {
      try {
        console.log("online-user", id);

        const userData = await User.findById(id);
        const payload = {
          _id: userData?._id,
          name: userData?.username,
          email: userData?.email,
          profile_pic: userData?.profile_pic,
          role: userData?.role,
          online: onlineUser.has(id),
        };
        socket.emit("messageUser", payload);

        // Fetch previous order messages
        const getConversationOrderMessage = await OrderConverModel.findOne({
          $or: [
            { sender: user?._id, receiver: id },
            { sender: id, receiver: user?._id },
          ],
        })
          .populate({
            path: "messages",
            match: { orderId: orderId },
          })
          .sort({ updateAt: -1 });

        socket.emit(
          "orderMessage",
          getConversationOrderMessage?.messages || []
        );
      } catch (error) {
        console.error("Error in messagePage:", error);
        socket.emit("error", { message: "Failed to load messages" });
      }
    });
    // Handle new order messages
    socket.on("newOrderMessage", async (data) => {
      try {
        let conversation = await OrderConverModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        });

        if (!conversation) {
          conversation = await OrderConverModel.create({
            sender: data?.sender,
            receiver: data?.receiver,
          });
        }

        const message = await OrderMessageModel.create({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoUrl: data?.videoUrl,
          fileUrl: data?.fileUrl,
          deliveryUrl: data?.deliveryUrl,
          msgByUserId: data?.msgByUserId,
          revision: data?.revision,
          orderId: data?.orderId,
        });

        await OrderConverModel.updateOne(
          { _id: conversation._id },
          { $push: { messages: message._id } }
        );

        const updatedConversation = await OrderConverModel.findOne({
          _id: conversation._id,
        }).populate({
          path: "messages",
          match: { orderId: data?.orderId },
        });

        io.to(data?.sender).emit(
          "orderMessage",
          updatedConversation?.messages || []
        );
        io.to(data?.receiver).emit(
          "orderMessage",
          updatedConversation?.messages || []
        );

        // Update conversation lists
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.receiver).emit("conversation", conversationReceiver);
      } catch (error) {
        console.error("Error in newMessage:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle single message delete order
    socket.on("deleteMessageOrder", async (messageId) => {
      try {
        // Find the message and remove it
        const message = await OrderMessageModel.findByIdAndDelete(messageId);
        if (!message) {
          return socket.emit("error", { message: "Message not found" });
        }

        // Remove the message from the conversation
        await ConverModel.updateOne(
          { messages: messageId },
          { $pull: { messages: messageId } }
        );

        // Emit updated conversation
        const conversation = await OrderConverModel.findById(
          message.conversationId
        ).populate({
          path: "messages",
          match: { orderId: data?.orderId },
        });
        io.to(message.sender).emit(
          "orderMessage",
          conversation?.messages || []
        );
        io.to(message.receiver).emit(
          "orderMessage",
          conversation?.messages || []
        );
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", { message: "Failed to delete message" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUser.delete(user?._id?.toString());
      console.log("disconnect user", socket.id);
      io.emit("onlineUser", Array.from(onlineUser));
    });
  } catch (error) {
    console.error("Error during connection:", error);
    socket.disconnect();
  }
});

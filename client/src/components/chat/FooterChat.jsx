import React, { useState } from "react";
import { Dropdown, TextInput } from "flowbite-react";
import { FiPlus } from "react-icons/fi";
import { FaImage, FaVideo } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { BiSolidOffer } from "react-icons/bi";
import toast from "react-hot-toast";
import { uploadFileCloud } from "../../helpers/uploadFileCloud";
import { useSelector } from "react-redux";

export default function FooterChat({
  setMessage,
  message,
  imageLoading,
  setImageLoading,
  videoLoading,
  setVideoLoading,
  setFileLoading,
  fileLoading,
  setUploadPercentage,
  uploadPercentage,
  uploadBtn,
  setUploadBtn,
  userID,
  setOfferModal,
  offerModal,
}) {
  const { socketConnection, _id, role } = useSelector(
    (state) => state.userState
  );

  const handleImage = async (e) => {
    setImageLoading(true);
    setUploadBtn(false);
    const file = e.target.files[0];
    const upload = await uploadFileCloud(file);
    if (upload) {
      setMessage((preve) => {
        return {
          ...preve,
          imageUrl: upload?.url,
        };
      });
    }

    setImageLoading(false);
  };

  const handleVideo = async (e) => {
    setVideoLoading(true);
    setUploadBtn(false);
    const file = e.target.files[0];

    try {
      // Use axios's upload progress tracking
      const upload = await uploadFileCloud(file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total // Calculate the percentage
          );
          setUploadPercentage(percentCompleted); // Update the progress state
        },
      });

      if (upload?.url) {
        setMessage((prev) => ({
          ...prev,
          videoUrl: upload?.url, // Update the videos array
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("upload error!");
      setVideoLoading(false);
    }

    setVideoLoading(false);
  };

  const handleFile = async (e) => {
    setUploadBtn(false);
    setFileLoading(true);
    const file = e.target.files[0];

    try {
      // Use axios's upload progress tracking
      const upload = await uploadFileCloud(file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total // Calculate the percentage
          );
          setUploadPercentage(percentCompleted); // Update the progress state
        },
      });

      if (upload?.url) {
        setMessage((prev) => ({
          ...prev,
          fileUrl: upload?.url, // Update the videos array
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("upload error!");
      setFileLoading(false);
    }

    setFileLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "user") {
      if (
        message?.text ||
        message?.videoUrl ||
        message?.imageUrl ||
        message?.fileUrl
      ) {
        if (socketConnection) {
          socketConnection.emit("newMessage", {
            sender: _id,
            receiver: import.meta.env.VITE_MAIN_ADMIN_ID,
            text: message?.text,
            imageUrl: message?.imageUrl,
            videoUrl: message?.videoUrl,
            fileUrl: message?.fileUrl,
            image: message?.image,
            price: message?.price,
            desc: message?.desc,
            title: message?.title,
            msgByUserId: _id,
            order: message?.order,
          });
        }
        setMessage({
          text: "",
          videoUrl: "",
          imageUrl: "",
          fileUrl: "",
        });
      }
    } else {
      if (
        message?.text ||
        message?.videoUrl ||
        message?.imageUrl ||
        message?.fileUrl
      ) {
        if (socketConnection) {
          socketConnection.emit("newMessage", {
            sender: _id,
            receiver: userID,
            text: message.text,
            imageUrl: message.imageUrl,
            videoUrl: message.videoUrl,
            fileUrl: message.fileUrl,
            image: message?.image,
            price: message?.price,
            desc: message?.desc,
            title: message?.title,
            msgByUserId: _id,
            order: message?.order,
          });
        }
        setMessage({
          text: "",
          videoUrl: "",
          imageUrl: "",
          fileUrl: "",
        });
      }
    }
  };

  return (
    <div>
      <div className="w-full flex items-center gap-4 dark:bg-slate-700">
        <div className=" relative">
          <button
            onClick={() => setUploadBtn(!uploadBtn)}
            className=" w-11 h-11 flex items-center justify-center hover:bg-teal-400 rounded-full  hover:text-white transition-all duration-300 ">
            <FiPlus size={20} />
          </button>

          {uploadBtn && (
            <div className=" bg-white shadow rounded absolute bottom-12 left-3 w-36 p-2 flex flex-col gap-2">
              {/* Image Input */}
              <label
                htmlFor="uploadImage"
                className="flex items-center gap-2 hover:bg-slate-200 p-3 cursor-pointer ">
                <FaImage size={18} className="text-teal-500" />

                <p>Image</p>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  id="uploadImage"
                  onChange={handleImage}
                />
              </label>

              {/* Video Input */}

              <label
                htmlFor="uploadVideo"
                className="flex items-center gap-2 hover:bg-slate-200 p-3 cursor-pointer">
                <FaVideo size={18} className="text-purple-500" />
                <p>Video</p>
                <input
                  className="hidden"
                  type="file"
                  accept="video/*"
                  id="uploadVideo"
                  onChange={handleVideo}
                />
              </label>

              {/* File Input */}

              <label
                htmlFor="uploadFile"
                className="flex items-center gap-2 hover:bg-slate-200 p-3 cursor-pointer">
                <GoFileDirectoryFill size={18} className="text-blue-500" />
                <p>File</p>
                <input
                  className="hidden"
                  type="file"
                  accept=".doc,.docx,.pdf,.txt,.xls,.xlsx"
                  id="uploadFile"
                  onChange={handleFile}
                />
              </label>

              {/* offer */}
              {role === "admin" && (
                <div className="">
                  <button
                    onClick={() => setOfferModal(!offerModal)}
                    className="flex items-center gap-2 hover:bg-slate-200 p-3 cursor-pointer">
                    <BiSolidOffer size={18} className=" text-sky-500" />
                    <p>Offer</p>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className=" flex items-center gap-3">
          <div>
            {message?.title && (
              <div className=" flex items-center gap-3 ">
                <img
                  className=" w-[100px] h-[100px] object-contain"
                  src={message?.image}
                  alt=""
                />
                <div className="">
                  <p className=" text-lg font-semibold">{message?.title}</p>
                  <p className=" text-sm ">{message?.desc}</p>
                  <p>$ {message?.price}</p>
                </div>
              </div>
            )}
            <TextInput
              value={message?.text}
              onChange={(e) =>
                setMessage({
                  ...message,
                  text: e.target.value,
                })
              }
              className="md:w-[500px]"
              placeholder="Message..."
            />
          </div>

          <div>
            <button type="submit">
              <IoSendSharp
                size={38}
                className="text-blue-600 hover:text-blue-400 transition-all duration-300"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

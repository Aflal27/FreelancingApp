import React, { useEffect, useRef, useState } from "react";
import HeaderChat from "./HeaderChat";
import FooterChat from "./FooterChat";
import { Button, Dropdown, Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import { FaDownload } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiPassExpiredLine } from "react-icons/ri";

//

import { RxCross1 } from "react-icons/rx";
import { Spinner } from "flowbite-react";
import { FaFileAlt } from "react-icons/fa";
import Offer from "./Offer";

export default function MainChat({
  setOpenModal,
  openModal,
  userID,
  message,
  setMessage,
}) {
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadBtn, setUploadBtn] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const [offerModal, setOfferModal] = useState(false);
  const currentMsg = useRef();
  const [deleteMsg, setDeleteMsg] = useState("");
  const navigation = useNavigate();
  const { socketConnection, _id, role, onlineUser } = useSelector(
    (state) => state.userState
  );

  const userId = role === "admin" ? userID : import.meta.env.VITE_MAIN_ADMIN_ID;

  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMsg]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  useEffect(() => {
    if (socketConnection) {
      if (userId) {
        socketConnection.emit("messagePage", userId);
        socketConnection.emit("seen", userId);
        socketConnection.on("messageUser", (data) => {
          setUserData(data);
        });
      }
      if (_id) {
        socketConnection.on("message", (data) => {
          setAllMsg(data);
        });
      }
    }
  }, [socketConnection, _id, openModal, userID, deleteMsg, onlineUser]);

  const handleDeleteMessage = (messageId) => {
    setDeleteMsg(messageId);
    socketConnection.emit("deleteMessage", messageId);
  };

  // download
  const handleDownload = async (originalImage) => {
    try {
      const res = await fetch(originalImage);
      const file = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = new Date().getTime();
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOfferBtn = (data) => {
    console.log(data);

    navigation("/payment", {
      state: {
        orderData: data,
      },
    });
    setOpenModal(false);
  };

  return (
    <div className="">
      <div className="">
        {role && role === "admin" ? (
          <div className=" w-full">
            {/* modal header */}
            <div className=" bg-slate-100 shadow-md z-20">
              <HeaderChat userData={userData} />
            </div>
            {/* modal body */}
            <div className=" h-[calc(100vh-110px)]  overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50  ">
              {/* all message */}
              <div className=" flex flex-col gap-2 p-5 " ref={currentMsg}>
                {allMsg.map((msg, index) => {
                  const isDeletable =
                    moment().diff(moment(msg?.createdAt), "minutes") < 1;
                  return (
                    <div
                      className={`  p-1 py-1 rounded w-fit max-w-[200] md:max-w-sm lg:max-w-md ${
                        _id === msg.msgByUserId
                          ? "ml-auto bg-teal-200 dark:bg-teal-700"
                          : "bg-white dark:bg-slate-500"
                      }`}>
                      <div className=" w-full">
                        {msg.imageUrl && (
                          <div className="">
                            <img
                              src={msg.imageUrl}
                              alt="image"
                              className=" w-full h-full object-scale-down"
                            />
                          </div>
                        )}
                      </div>
                      <div className=" w-full">
                        {msg?.videoUrl && (
                          <video
                            controls
                            src={msg?.videoUrl}
                            className=" w-full h-full object-scale-down"
                          />
                        )}
                      </div>
                      <div className=" w-full">
                        {msg.fileUrl && (
                          <FaFileAlt className=" w-[100px] h-full object-scale-down" />
                        )}
                      </div>
                      <div className="w-full">
                        {msg.offer?.title && (
                          <div className="">
                            <div className="flex gap-4">
                              <div className="flex-1 ">
                                <img
                                  className="rounded-md object-cover w-full "
                                  src={msg?.offer?.image}
                                  alt={msg.offer?.title}
                                />
                              </div>
                              <div className="flex flex-col flex-1 w-[100px]">
                                <p className="font-semibold text-lg">
                                  {msg?.offer?.title}
                                </p>
                                <p className="text-sm  text-gray-600 line-clamp-3">
                                  {msg?.offer?.description}
                                </p>

                                <div className=" flex justify-between items-center m-3">
                                  <div className="">
                                    <div className=" flex items-center gap-1">
                                      <TbTruckDelivery />
                                      <p className=" text-sm opacity-75">
                                        {msg?.offer?.delivery}
                                        <span>days-delivery</span>
                                      </p>
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <RiPassExpiredLine />
                                      <p className=" text-sm opacity-75">
                                        {msg?.offer?.expire}
                                        <span>days-expire</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="">
                                    <p className=" text-lg font-semibold">
                                      ${msg?.offer?.price}
                                    </p>
                                  </div>
                                </div>

                                <div className=" flex items-center flex-wrap justify-evenly">
                                  {msg?.offer?.packages?.map((pack, index) => (
                                    <p key={index} className=" text-xs">
                                      {pack}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className=" mt-4">
                              <Button
                                onClick={() => handleOfferBtn(msg?.offer)}
                                className=" w-full"
                                outline
                                gradientDuoTone="purpleToBlue">
                                Order Now
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Specific gig */}
                      {msg?.image && (
                        <div className=" flex items-center mb-2">
                          <img
                            className=" flex-1 w-[100px] h-[100px] object-contain"
                            src={msg?.image}
                            alt={msg?.title}
                          />
                          <div className=" flex-1">
                            <p className=" text-lg font-semibold">
                              {msg?.title}
                            </p>
                            <p className=" text-sm ">{msg?.desc}</p>
                            <p className=" text-xs ">$ {msg?.price}</p>
                          </div>
                        </div>
                      )}
                      <p className=" px-2">{msg.text}</p>

                      <p className=" text-xs ml-auto w-fit flex items-center gap-10">
                        {moment(msg?.createdAt).format("hh:mm")}
                        {_id === msg.msgByUserId && (
                          <Dropdown
                            inline
                            arrowIcon={false}
                            label={
                              <BsThreeDots
                                className="hover:text-red-600"
                                size={20}
                              />
                            }>
                            {isDeletable ? (
                              <Dropdown.Item
                                onClick={() => handleDeleteMessage(msg._id)}>
                                Delete
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item disabled className="text-gray-400">
                                Delete (disabled)
                              </Dropdown.Item>
                            )}
                          </Dropdown>
                        )}
                        {(msg?.imageUrl || msg?.videoUrl || msg?.fileUrl) && (
                          <FaDownload
                            size={22}
                            className=" hover:opacity-50 transition-all duration-300"
                            onClick={() =>
                              handleDownload(
                                msg?.imageUrl || msg?.videoUrl || msg?.fileUrl
                              )
                            }
                          />
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* image loading */}
              {imageLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {/* video loading */}
              {videoLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <p className=" text-2xl font-semibold text-teal-400">
                    {uploadPercentage} please wait!...
                  </p>
                </div>
              )}
              {/* file loading */}
              {fileLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <p className=" text-2xl font-semibold text-teal-400">
                    {uploadPercentage} please wait!...
                  </p>
                </div>
              )}

              {/* image */}
              {message?.imageUrl && (
                <div className="  w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30  flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ imageUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <img
                      src={message?.imageUrl}
                      alt="uploadImage"
                      height={300}
                      width={300}
                      className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                    />
                  </div>
                </div>
              )}
              {/* display video */}
              {message?.videoUrl && (
                <div className=" w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ videoUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800 object-scale-down"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <video
                      src={message?.videoUrl}
                      className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                      controls
                      muted
                      autoPlay></video>
                  </div>
                </div>
              )}
              {/* display file */}
              {message?.fileUrl && (
                <div className=" w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ videoUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800 object-scale-down"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <FaFileAlt className=" h-[350px] w-[200px]" />
                  </div>
                </div>
              )}
            </div>
            {/* modal footer */}
            <div className=" bg-slate-100 shadow-md w-full z-10">
              <FooterChat
                userID={userID}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
                videoLoading={videoLoading}
                setVideoLoading={setVideoLoading}
                setFileLoading={setFileLoading}
                fileLoading={fileLoading}
                setUploadPercentage={setUploadPercentage}
                uploadPercentage={uploadPercentage}
                uploadBtn={uploadBtn}
                setUploadBtn={setUploadBtn}
                setMessage={setMessage}
                message={message}
                setOfferModal={setOfferModal}
                offerModal={offerModal}
              />
            </div>
          </div>
        ) : (
          <Modal
            show={openModal}
            onClose={() => setOpenModal(false)}
            className=" transition-all duration-300 ">
            {/* modal header */}
            <Modal.Header className=" bg-slate-100 shadow-md dark:bg-slate-500">
              <HeaderChat />
            </Modal.Header>
            {/* modal body */}
            <Modal.Body className=" bg-slate-200 dark:bg-slate-500 ">
              {/* all message */}
              <div className=" flex flex-col gap-2 p-5 " ref={currentMsg}>
                {allMsg?.length === 0 && (
                  <div className="">
                    <p>Example</p>
                  </div>
                )}
                {allMsg.map((msg, index) => {
                  const isDeletable =
                    moment().diff(moment(msg?.createdAt), "minutes") < 1;
                  return (
                    <div
                      className={`  p-1 py-1 rounded w-fit max-w-[200] md:max-w-sm lg:max-w-md ${
                        _id === msg.msgByUserId
                          ? "ml-auto bg-teal-200 dark:bg-teal-700"
                          : "bg-white dark:bg-slate-500"
                      }`}>
                      <div className=" w-full">
                        {msg.imageUrl && (
                          <div className="">
                            <img
                              src={msg.imageUrl}
                              alt="image"
                              className=" w-full h-full object-scale-down"
                            />
                          </div>
                        )}
                      </div>
                      <div className=" w-full">
                        {msg?.videoUrl && (
                          <video
                            controls
                            src={msg?.videoUrl}
                            className=" w-full h-full object-scale-down"
                          />
                        )}
                      </div>
                      <div className=" w-full">
                        {msg.fileUrl && (
                          <FaFileAlt className=" w-[100px] h-full object-scale-down" />
                        )}
                      </div>
                      <div className="w-full">
                        {msg.offer?.title && (
                          <div className="">
                            <div className="flex gap-4">
                              <div className="flex-1 ">
                                <img
                                  className="rounded-md object-cover w-full "
                                  src={msg?.offer?.image}
                                  alt={msg.offer?.title}
                                />
                              </div>
                              <div className="flex flex-col flex-1 w-[100px]">
                                <p className="font-semibold text-lg">
                                  {msg?.offer?.title}
                                </p>
                                <p className="text-sm  text-gray-600 line-clamp-3">
                                  {msg?.offer?.description}
                                </p>

                                <div className=" flex justify-between items-center m-3">
                                  <div className="">
                                    <div className=" flex items-center gap-1">
                                      <TbTruckDelivery />
                                      <p className=" text-sm opacity-75">
                                        {msg?.offer?.delivery}
                                        <span>days-delivery</span>
                                      </p>
                                    </div>
                                    <div className=" flex items-center gap-1">
                                      <RiPassExpiredLine />
                                      <p className=" text-sm opacity-75">
                                        {msg?.offer?.expire}
                                        <span>days-expire</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="">
                                    <p className=" text-lg font-semibold">
                                      ${msg?.offer?.price}
                                    </p>
                                  </div>
                                </div>

                                <div className=" flex items-center flex-wrap justify-evenly">
                                  {msg?.offer?.packages?.map((pack, index) => (
                                    <p key={index} className=" text-xs">
                                      {pack}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className=" mt-4">
                              <Button
                                onClick={() => handleOfferBtn(msg?.offer)}
                                className=" w-full"
                                outline
                                gradientDuoTone="purpleToBlue">
                                Order Now
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Specific gig */}
                      {msg?.image && (
                        <div className=" flex items-center mb-2">
                          <img
                            className=" flex-1 w-[100px] h-[100px] object-contain"
                            src={msg?.image}
                            alt={msg?.title}
                          />
                          <div className=" flex-1">
                            <p className=" text-lg font-semibold">
                              {msg?.title}
                            </p>
                            <p className=" text-sm ">{msg?.desc}</p>
                            <p className=" text-xs ">$ {msg?.price}</p>
                          </div>
                        </div>
                      )}
                      <p className=" px-2">{msg.text}</p>

                      <p className=" text-xs ml-auto w-fit flex items-center gap-10">
                        {moment(msg?.createdAt).format("hh:mm")}
                        {_id === msg.msgByUserId && (
                          <Dropdown
                            inline
                            arrowIcon={false}
                            label={
                              <BsThreeDots
                                className="hover:text-red-600"
                                size={20}
                              />
                            }>
                            {isDeletable ? (
                              <Dropdown.Item
                                onClick={() => handleDeleteMessage(msg._id)}>
                                Delete
                              </Dropdown.Item>
                            ) : (
                              <Dropdown.Item disabled className="text-gray-400">
                                Delete (disabled)
                              </Dropdown.Item>
                            )}
                          </Dropdown>
                        )}
                        {(msg?.imageUrl || msg?.videoUrl || msg?.fileUrl) && (
                          <FaDownload
                            size={22}
                            className=" hover:opacity-50 transition-all duration-300"
                            onClick={() =>
                              handleDownload(
                                msg?.imageUrl || msg?.videoUrl || msg?.fileUrl
                              )
                            }
                          />
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* image loading */}
              {imageLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <Spinner />
                </div>
              )}
              {/* video loading */}
              {videoLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <p className=" text-2xl font-semibold text-teal-400">
                    {uploadPercentage} please wait!...
                  </p>
                </div>
              )}
              {/* file loading */}
              {fileLoading && (
                <div className=" sticky bottom-0 w-full h-full flex items-center justify-center">
                  <p className=" text-2xl font-semibold text-teal-400">
                    {uploadPercentage} please wait!...
                  </p>
                </div>
              )}

              {/* image */}
              {message.imageUrl && (
                <div className="  w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30  flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ imageUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <img
                      src={message?.imageUrl}
                      alt="uploadImage"
                      height={300}
                      width={300}
                      className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                    />
                  </div>
                </div>
              )}
              {/* display video */}
              {message.videoUrl && (
                <div className=" w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ videoUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800 object-scale-down"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <video
                      src={message?.videoUrl}
                      className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                      controls
                      muted
                      autoPlay></video>
                  </div>
                </div>
              )}
              {/* display file */}
              {message.fileUrl && (
                <div className=" w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex items-center justify-center rounded overflow-hidden">
                  <div className=" w-fit p-5 absolute top-0 right-0">
                    <RxCross1
                      onClick={() => setMessage({ videoUrl: "" })}
                      size={30}
                      className=" text-white  cursor-pointer hover:bg-red-800 object-scale-down"
                    />
                  </div>
                  <div className=" bg-white p-3">
                    <FaFileAlt className=" h-[350px] w-[200px]" />
                  </div>
                </div>
              )}
            </Modal.Body>
            {/* modal footer */}
            <Modal.Footer className=" bg-slate-100 shadow-md w-full">
              <FooterChat
                userID={userID}
                imageLoading={imageLoading}
                setImageLoading={setImageLoading}
                videoLoading={videoLoading}
                setVideoLoading={setVideoLoading}
                setFileLoading={setFileLoading}
                fileLoading={fileLoading}
                setUploadPercentage={setUploadPercentage}
                uploadPercentage={uploadPercentage}
                uploadBtn={uploadBtn}
                setUploadBtn={setUploadBtn}
                setMessage={setMessage}
                message={message}
              />
            </Modal.Footer>
          </Modal>
        )}
      </div>

      {/* offer modal */}
      {offerModal && (
        <Offer
          userID={userID}
          message={message}
          setMessage={setMessage}
          setOfferModal={setOfferModal}
          offerModal={offerModal}
        />
      )}
    </div>
  );
}

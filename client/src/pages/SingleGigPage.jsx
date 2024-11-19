import React, { useEffect, useState } from "react";
import { singleGig } from "../utils/singleGig";
import { IoHomeOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import { Table } from "flowbite-react";
import { FaCheck } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { BiRevision } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "../components/layout/Avatar";
import { Helmet } from "react-helmet-async";

export default function SingleGigPage({ setOpenModal, setMessage, message }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [handleGig, setHandleGig] = useState("Basic");
  const [handleArrow, setHandleArrow] = useState(false);
  const [handleModal, setHandleModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [gigData, setGigData] = useState({});
  const navigation = useNavigate();
  const [handleModalData, setHandleModalData] = useState("");
  const [orderData, setOrderData] = useState({
    id: "",
    image: "",
    title: "",
    description: "",
    totalPrice: 0,
    delivery: 0,
    packages: [],
  });

  const { state } = useLocation();

  useEffect(() => {
    if (state?.gigData) {
      setGigData(state.gigData);
      const fetchData = async () => {
        const mainCat = state.gigData?.mainCat;
        try {
          const { data } = await axios.get(
            `/api/category/get-packages/${mainCat}`
          );
          setPackages(data[0]?.packages);
        } catch (error) {
          console.log("getPackagesError", error);
        }
      };
      fetchData();
    }
  }, [state]);

  const handleOrder = (data) => {
    if (data === "basic") {
      setOrderData({
        id: gigData?._id,
        image: gigData?.images[0],
        title: gigData?.base?.title,
        description: gigData?.base?.description,
        totalPrice: gigData?.base?.price,
        delivery: gigData?.base?.delivery,
        packages: [...gigData?.base?.packages],
      });
      if (orderData?.image && orderData?.totalPrice) {
        navigation("/payment", {
          state: {
            orderData,
          },
        });
      }
    }
    if (data === "silver") {
      setOrderData({
        id: gigData?._id,
        image: gigData?.images[0],
        title: gigData?.silver?.title,
        description: gigData?.silver?.description,
        totalPrice: gigData?.silver?.price,
        delivery: gigData?.silver?.delivery,
        packages: [...gigData?.base?.packages],
      });
      if (orderData?.image && orderData?.totalPrice) {
        navigation("/payment", {
          state: {
            orderData,
          },
        });
      }
    }
    if (data === "platinum") {
      setOrderData({
        id: gigData?._id,
        image: gigData?.images[0],
        title: gigData?.platinum?.title,
        description: gigData?.platinum?.description,
        totalPrice: gigData?.platinum?.price,
        delivery: gigData?.platinum?.delivery,
        packages: [...gigData?.platinum?.packages],
      });
      if (orderData?.image && orderData?.totalPrice) {
        navigation("/payment", {
          state: {
            orderData,
          },
        });
      }
    }
  };

  return (
    <div className="">
      <Helmet>
        <title>{`${
          gigData?.title || "Service"
        } - Hire Freelancers on DBAE Freelancing`}</title>
        <meta
          name="description"
          content={`Explore ${
            gigData?.title || "freelance"
          } services on DBAE Freelancing. Hire expert freelancers in Sri Lanka for quality results.`}
        />
        <meta
          name="keywords"
          content={`DBAE Freelancing ${
            gigData?.title || "service"
          }, hire freelancer ${
            gigData?.title || "service"
          }, freelance services in Sri Lanka, ${
            gigData?.title || "service"
          } services`}
        />
      </Helmet>
      <div className=" lg:flex lg:gap-8 xl:gap-24 m-5 md:mx-10 md:my-10 ">
        {/* gig-details */}
        <div className=" flex-1">
          <div className=" flex flex-col gap-10">
            {/* catagory */}
            <div className=" flex items-center gap-3">
              <IoHomeOutline className=" w-5 h-5 " />
              <span>/</span>
              <p className=" text-sm md:text-lg font-semibold">
                {gigData?.mainCat}
              </p>
              <span>/</span>
              <p className=" text-sm md:text-lg font-semibold">
                {gigData?.subCat}
              </p>
            </div>
            {/* title */}
            <div className="">
              <p className=" text-sm md:text-xl font-semibold line-clamp-2 ">
                {gigData?.title}
              </p>
            </div>
            {/* gig image & video */}
            <div className="">
              <div className=" container mx-auto">
                {/* Main Swiper */}
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  modules={[Thumbs, FreeMode, Navigation]}
                  thumbs={{ swiper: thumbsSwiper }}
                  className="mySwiper2 max-w-xl">
                  {gigData?.videos?.map((v, index) => (
                    <SwiperSlide key={index}>
                      <video className="" src={v} muted autoPlay></video>
                    </SwiperSlide>
                  ))}
                  {gigData?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} alt="Main 1" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnails Swiper */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Thumbs, FreeMode, Navigation]}
                  className="mySwiper max-w-xl ">
                  {gigData?.videos?.map((v, index) => (
                    <SwiperSlide key={index}>
                      <video className="" src={v} muted autoPlay></video>
                    </SwiperSlide>
                  ))}
                  {gigData?.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} alt="Main 1" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            {/* about gig */}
            <div className="">
              <h3 className=" text-lg md:text-xl font-semibold mb-3">
                About this gig
              </h3>
              <p
                className=" text-xs md:text-sm"
                dangerouslySetInnerHTML={{
                  __html: gigData?.description && gigData?.description,
                }}></p>
            </div>
            {/* packages */}
            <div className=" overflow-x-auto ">
              <h3 className=" text-lg font-semibold mb-3">Packages</h3>
              <Table>
                <Table.Head>
                  <Table.HeadCell>Packages</Table.HeadCell>
                  <Table.HeadCell>Base</Table.HeadCell>
                  <Table.HeadCell>Silver</Table.HeadCell>
                  <Table.HeadCell>Platinum</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell></Table.Cell>

                    <Table.Cell className=" ">
                      <p className=" mb-2">${gigData?.base?.price}</p>
                      <p className=" text-lg font-semibold mb-2">
                        {gigData?.base?.title}
                      </p>
                      <p>{gigData?.base?.description}</p>
                    </Table.Cell>

                    <Table.Cell className="">
                      <p className=" mb-2"> ${gigData?.silver?.price}</p>
                      <p className=" text-lg font-semibold mb-2">
                        {gigData?.silver?.title}
                      </p>
                      <p> {gigData?.silver?.description}</p>
                    </Table.Cell>

                    <Table.Cell>
                      <p className=" mb-2"> ${gigData?.platinum?.price}</p>
                      <p className=" text-lg font-semibold mb-2">
                        {gigData?.platinum?.title}
                      </p>
                      <p> {gigData?.platinum?.description}</p>
                    </Table.Cell>
                  </Table.Row>
                  {packages?.map((pack, index) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <p>{pack?.pack}</p>
                      </Table.Cell>
                      <Table.Cell>
                        {gigData?.base?.packages?.find(
                          (p) => p?.name === pack?.pack && p?.check
                        ) ? (
                          <FaCheck />
                        ) : gigData?.base?.packages?.find(
                            (p) => p?.name === pack?.pack && p?.number
                          ) ? (
                          <p>
                            {
                              gigData?.base?.packages?.find(
                                (p) => p?.name === pack?.pack
                              )?.number
                            }
                          </p>
                        ) : gigData?.base?.packages?.find(
                            (p) =>
                              p?.name === pack?.pack &&
                              p?.option === "unlimited"
                          ) ? (
                          <p>unlimited</p>
                        ) : (
                          <p>-</p>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {gigData?.silver?.packages?.find(
                          (p) => p?.name === pack?.pack && p?.check
                        ) ? (
                          <FaCheck />
                        ) : gigData?.silver?.packages?.find(
                            (p) => p?.name === pack?.pack && p?.number
                          ) ? (
                          <p>
                            {
                              gigData?.silver?.packages?.find(
                                (p) => p?.name === pack?.pack
                              )?.number
                            }
                          </p>
                        ) : gigData?.silver?.packages?.find(
                            (p) =>
                              p?.name === pack?.pack &&
                              p?.option === "unlimited"
                          ) ? (
                          <p>unlimited</p>
                        ) : (
                          <p>-</p>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {gigData?.platinum?.packages?.find(
                          (p) => p?.name === pack?.pack && p?.check
                        ) ? (
                          <FaCheck />
                        ) : gigData?.platinum?.packages?.find(
                            (p) => p?.name === pack?.pack && p?.number
                          ) ? (
                          <p>
                            {
                              gigData?.platinum?.packages?.find(
                                (p) => p?.name === pack?.pack
                              )?.number
                            }
                          </p>
                        ) : gigData?.platinum?.packages?.find(
                            (p) =>
                              p?.name === pack?.pack &&
                              p?.option === "unlimited"
                          ) ? (
                          <p>unlimited</p>
                        ) : (
                          <p>-</p>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>Total</Table.Cell>
                    <Table.Cell>${gigData?.base?.price}</Table.Cell>
                    <Table.Cell>${gigData?.silver?.price}</Table.Cell>
                    <Table.Cell>${gigData?.platinum?.price}</Table.Cell>
                  </Table.Row>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell></Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setHandleModal(true),
                            setHandleModalData("base"),
                            handleOrder("basic");
                        }}
                        className=" bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-lg">
                        Select
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setHandleModal(true),
                            setHandleModalData("silver"),
                            handleOrder("silver");
                        }}
                        className=" bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-lg">
                        Select
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setHandleModal(true),
                            setHandleModalData("platinum"),
                            handleOrder("platinum");
                        }}
                        className=" bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-lg">
                        Select
                      </button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
            {/* review */}

            <div className="h-[500px] overflow-scroll">
              <h3 className="text-xl font-semibold mb-3">Reviews</h3>
              {gigData?.reviews?.map((review, index) => (
                <div
                  key={review._id}
                  className="mb-5 border border-gray-300 dark:border-gray-600 rounded-xl p-3 dark:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={review?.name}
                      image={review?.profilePic}
                      width={50}
                      height={50}
                    />

                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-200">
                      {review?.name}
                    </p>
                  </div>
                  <div className="border border-b border-gray-200 m-3"></div>
                  {/* Review body */}
                  <div className="flex items-center justify-between">
                    {/* Review details */}
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <FaStar key={i} className="text-yellow-500" />
                          ))}
                        </div>
                        <span className="text-sm ml-2">{review.rating}</span>
                      </div>
                      <div>
                        <p className="text-md text-gray-500 dark:text-gray-200">
                          {review?.comment}
                        </p>
                      </div>
                    </div>
                    {/* Gig image */}
                    <div>
                      <img
                        className="w-[120px] md:w-[200px] h-24 object-cover"
                        src={gigData?.images[0]}
                        alt="Gig Image"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* gig-price */}
        <div className=" flex-1 ">
          <div className="  lg:w-[355px]">
            <div className=" w-full flex">
              <button
                onClick={() => setHandleGig("Basic")}
                className=" border border-gray-400 w-full px-4 py-2 md:px-8 md:py-3 bg-gray-300 dark:bg-gray-700 dark:border-gray-700 text-sm font-semibold hover:bg-gray-200 transition duration-300">
                Basic
              </button>
              <button
                onClick={() => setHandleGig("Standard")}
                className=" border border-l-0 border-gray-400 w-full px-4 py-2 md:px-8 md:py-3 bg-gray-300 dark:bg-gray-700 dark:border-gray-700 text-sm font-semibold hover:bg-gray-200 transition duration-300">
                Standard
              </button>
              <button
                onClick={() => setHandleGig("Premium")}
                className=" border border-l-0 border-gray-400 w-full px-4 py-2 md:px-8 md:py-3 bg-gray-300 dark:bg-gray-700 dark:border-gray-700 text-sm font-semibold hover:bg-gray-200 transition duration-300">
                Premium
              </button>
            </div>
            <div className=" w-full border dark:border-gray-700 p-3">
              {/* basic details */}
              {handleGig === "Basic" && (
                <div className="">
                  <div className=" flex items-center justify-between mb-3">
                    <div className=" text-sm font-semibold">
                      {gigData?.base?.title}
                    </div>
                    <div className=""> ${gigData?.base?.price}</div>
                  </div>

                  <div className="">
                    <p className=" text-xs mb-3">
                      {" "}
                      {gigData?.base?.description}
                    </p>
                  </div>
                  <div className=" flex items-center gap-3">
                    <div className=" flex items-center gap-1">
                      <IoIosTimer />
                      <div className=" flex items-center">
                        <p className=" text-xs font-semibold">
                          {gigData?.base?.delivery}
                        </p>
                        <p className=" text-xs font-semibold">-day-delivery</p>
                      </div>
                    </div>
                  </div>

                  <div className=" flex items-center justify-between">
                    <p className=" text-sm font-semibold mt-3">
                      Whats included
                    </p>
                    <div className="">
                      {handleArrow ? (
                        <IoIosArrowUp
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      ) : (
                        <IoIosArrowDown
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      )}
                    </div>
                  </div>
                  <div className="">
                    {handleArrow && (
                      <div className=" flex flex-col gap-3 mt-2">
                        {gigData?.base?.packages?.map((sub, index) => (
                          <div className=" flex items-center  gap-4">
                            <p className=" text-xs ">{sub?.name}</p>
                            <p className=" text-xs text-gray-400">
                              {(sub?.check && <FaCheck />) ||
                                (sub?.number && sub?.number) ||
                                (sub?.option === "unlimited" && sub?.option)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* continue btn */}
                  <div className=" mt-3">
                    <button
                      onClick={() => handleOrder("basic")}
                      className=" bg-black dark:bg-gray-200 text-white dark:text-black w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:brightness-50">
                      <p className=" ">Continue</p>
                      <FaArrowRightLong />
                    </button>
                    <button className=" text-sm text-center w-full mb-3 ">
                      Compare package
                    </button>
                    <button
                      onClick={() => {
                        setOpenModal(true),
                          setMessage({
                            ...message,
                            image: gigData?.images[0],
                            price: gigData?.base?.price,
                            desc: gigData?.base?.description,
                            title: gigData?.base?.title,
                          });
                      }}
                      className=" border border-gray-400 w-full text-center p-3 hover:bg-slate-400 transition duration-300">
                      Contact me
                    </button>
                  </div>
                </div>
              )}
              {/* Standerd details */}
              {handleGig === "Standard" && (
                <div className="">
                  <div className=" flex items-center justify-between mb-3">
                    <div className=" text-sm font-semibold">
                      {gigData?.silver?.title}
                    </div>
                    <div className=""> ${gigData?.silver?.price}</div>
                  </div>

                  <div className="">
                    <p className=" text-xs mb-3">
                      {" "}
                      {gigData?.silver?.description}
                    </p>
                  </div>
                  <div className=" flex items-center gap-3">
                    <div className=" flex items-center gap-1">
                      <IoIosTimer />
                      <div className=" flex items-center">
                        <p className=" text-xs font-semibold">
                          {gigData?.silver?.delivery}
                        </p>
                        <p className=" text-xs font-semibold">-day-delivery</p>
                      </div>
                    </div>
                  </div>

                  <div className=" flex items-center justify-between">
                    <p className=" text-sm font-semibold mt-3">
                      Whats included
                    </p>
                    <div className="">
                      {handleArrow ? (
                        <IoIosArrowUp
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      ) : (
                        <IoIosArrowDown
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      )}
                    </div>
                  </div>
                  <div className="">
                    {handleArrow && (
                      <div className=" flex flex-col gap-3 mt-2">
                        {gigData?.silver?.packages?.map((sub, index) => (
                          <div className=" flex items-center  gap-4">
                            <p className=" text-xs ">{sub?.name}</p>
                            <p className=" text-xs text-gray-400">
                              {(sub?.check && <FaCheck />) ||
                                (sub?.number && sub?.number) ||
                                (sub?.option === "unlimited" && sub?.option)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* continue btn */}
                  <div className=" mt-3">
                    <button
                      onClick={() => handleOrder("silver")}
                      className=" bg-black dark:bg-gray-200 text-white dark:text-black w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:brightness-50">
                      <p className=" ">Continue</p>
                      <FaArrowRightLong />
                    </button>
                    <button className=" text-sm text-center w-full mb-3 ">
                      Compare package
                    </button>
                    <button
                      onClick={() => {
                        setOpenModal(true),
                          setMessage({
                            ...message,
                            image: gigData?.images[0],
                            price: gigData?.silver?.price,
                            desc: gigData?.silver?.description,
                            title: gigData?.silver?.title,
                          });
                      }}
                      className=" border border-gray-400 w-full text-center p-3 hover:bg-slate-400 transition duration-300">
                      Contact me
                    </button>
                  </div>
                </div>
              )}
              {/* Primium details */}
              {handleGig === "Premium" && (
                <div className="">
                  <div className=" flex items-center justify-between mb-3">
                    <div className=" text-sm font-semibold">
                      {gigData?.platinum?.title}
                    </div>
                    <div className="">${gigData?.platinum?.price}</div>
                  </div>

                  <div className="">
                    <p className=" text-xs mb-3">
                      {gigData?.platinum?.description}
                    </p>
                  </div>
                  <div className=" flex items-center gap-3">
                    <div className=" flex items-center gap-1">
                      <IoIosTimer />
                      <div className=" flex items-center">
                        <p className=" text-xs font-semibold">
                          {gigData?.platinum?.delivery}
                        </p>
                        <p className=" text-xs font-semibold">-day-delivery</p>
                      </div>
                    </div>
                  </div>

                  <div className=" flex items-center justify-between">
                    <p className=" text-sm font-semibold mt-3">
                      Whats included
                    </p>
                    <div className="">
                      {handleArrow ? (
                        <IoIosArrowUp
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      ) : (
                        <IoIosArrowDown
                          onClick={() => setHandleArrow(!handleArrow)}
                          size={22}
                        />
                      )}
                    </div>
                  </div>
                  <div className="">
                    {handleArrow && (
                      <div className=" flex flex-col gap-3 mt-2">
                        {gigData?.platinum?.packages?.map((sub, index) => (
                          <div className=" flex items-center  gap-4">
                            <p className=" text-xs ">{sub?.name}</p>
                            <p className=" text-xs text-gray-400">
                              {(sub?.check && <FaCheck />) ||
                                (sub?.number && sub?.number) ||
                                (sub?.option === "unlimited" && sub?.option)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* continue btn */}
                  <div className=" mt-3">
                    <button
                      onClick={() => handleOrder("platinum")}
                      className=" bg-black dark:bg-gray-200 text-white dark:text-black w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:brightness-50">
                      <p className=" ">Continue</p>
                      <FaArrowRightLong />
                    </button>
                    <button className=" text-sm text-center w-full mb-3 ">
                      Compare package
                    </button>
                    <button
                      onClick={() => {
                        setOpenModal(true),
                          setMessage({
                            ...message,
                            image: gigData?.images[0],
                            price: gigData?.platinum?.price,
                            desc: gigData?.platinum?.description,
                            title: gigData?.platinum?.title,
                          });
                      }}
                      className=" border border-gray-400 w-full text-center p-3 hover:bg-slate-400 transition duration-300">
                      Contact me
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      {handleModal && (
        <div className=" fixed z-10 top-0 right-0 bg-gray-100  md:w-[500px]  h-screen  overflow-auto shadow-2xl ">
          <div className=" w-full">
            {/* header */}
            <div className=" sticky top-0  bg-white w-full shadow-md  ">
              <div className=" w-full flex items-center justify-between   py-3 px-2">
                <p className=" text-lg">Order options</p>
                <IoMdClose
                  onClick={() => setHandleModal(false)}
                  className=" hover:text-gray-400 "
                  size={22}
                />
              </div>
            </div>
            <div className=" border-b border-gray-400 "></div>
            <div className=""></div>
            {/* body */}
            <div className=" mt-10 p-5">
              {/* body cart */}
              {handleModalData === "base" && (
                <div className=" border border-gray-400 p-4 rounded-lg">
                  <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                      {gigData?.base?.title}
                    </p>
                    <p> ${gigData?.base?.price}</p>
                  </div>
                  <p className=" text-xs mt-2">{gigData?.base?.description}</p>
                  <hr className=" mt-2" />
                  <div className=" flex whitespace-nowrap flex-wrap gap-3 mt-2">
                    {gigData?.base?.packages?.map((sub, index) => (
                      <div className=" flex items-center  gap-4">
                        <p className=" text-xs ">{sub?.name}</p>
                        <p className=" text-xs text-gray-400">
                          {(sub?.check && <FaCheck />) ||
                            (sub?.number && sub?.number) ||
                            (sub?.option === "unlimited" && sub?.option)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {handleModalData === "silver" && (
                <div className=" border border-gray-400 p-4 rounded-lg">
                  <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                      {gigData?.silver?.title}
                    </p>
                    <p> ${gigData?.silver?.price}</p>
                  </div>
                  <p className=" text-xs mt-2">
                    {gigData?.silver?.description}
                  </p>
                  <hr className=" mt-2" />
                </div>
              )}
              {handleModalData === "platinum" && (
                <div className=" border border-gray-400 p-4 rounded-lg">
                  <div className=" flex items-center justify-between">
                    <p className=" text-lg font-semibold">
                      {gigData?.platinum?.title}
                    </p>
                    <p> ${gigData?.platinum?.price}</p>
                  </div>
                  <p className=" text-xs mt-2">
                    {gigData?.platinum?.description}
                  </p>
                  <hr className=" mt-2" />
                </div>
              )}
              <p className=" text-lg font-semibold m-2">
                Upgrade your order with extras
              </p>
              <div className=" flex flex-col gap-3">
                {gigData?.extraPackage?.map((extra, index) => (
                  <div className="">
                    {extra?.name && (
                      <div className=" border p-3 rounded-md flex items-center justify-between">
                        <div className="">
                          <p>{extra?.name}</p>
                          <p>{extra?.description}</p>
                          <p>${extra?.price}</p>
                          <p>{extra?.time} days</p>
                        </div>
                        <div className="">
                          <input
                            onChange={(e) => {
                              if (e.target.checked) {
                                setOrderData({
                                  ...orderData,
                                  totalPrice:
                                    orderData?.totalPrice + extra?.price,
                                  delivery: orderData?.delivery + extra?.time,
                                  packages: [...orderData?.packages, extra],
                                });
                              } else {
                                setOrderData({
                                  ...orderData,
                                  totalPrice:
                                    orderData?.totalPrice - extra?.price,
                                  delivery: orderData?.delivery - extra?.time,
                                  packages: orderData?.packages.filter(
                                    (pkg) => pkg !== extra
                                  ),
                                });
                              }
                            }}
                            className="rounded"
                            type="checkbox"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className=" sticky bottom-0 bg-white shadow-md ">
              <button
                onClick={() => {
                  if (orderData?.image && orderData?.totalPrice) {
                    navigation("/payment", {
                      state: {
                        orderData,
                      },
                    });
                  }
                }}
                className=" w-full bg-black dark:bg-gray-200 text-white dark:text-black  flex items-center justify-center gap-2 p-3 hover:brightness-50">
                <p className=" ">Continue</p>
                <p>${orderData?.totalPrice}</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Card,
  Modal,
  TextInput,
  Button,
  Label,
  Textarea,
} from "flowbite-react";
import { FaCheck, FaCircleArrowLeft } from "react-icons/fa6";
import OrderChat from "../components/chat/OrderChat";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const { _id, username, email, profile_pic } = useSelector(
    (state) => state.userState
  );
  const [selectedOrder, setSelectedOrder] = useState({});


  const [acceptOrder, setAcceptOrder] = useState("");
  const [ratingModal, setRatingModal] = useState(false);
  const [review, setReview] = useState({
    name: username,
    email,
    profilePic: profile_pic,
    rating: 0,
    comment: "",
  });

  const handleRatingClick = (value) => {
    setReview({
      ...review,
      rating: value,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/gig/create-reviews/${selectedOrder?.gig?.id}`,
        review
      );
      if (data) {
        toast.success("Review added!");
      }
      setSelectedOrder({});
      setRatingModal(false);
    } catch (error) {
      console.error("Error adding review:", error);
      setRatingModal(false);
      setSelectedOrder({});
    }
  };

  useEffect(() => {
    if (_id) {
      fetchOrders();
    }
  }, [_id]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/order/get-order-by-user/${_id}`);
      setOrders(response.data);
    } catch (err) {
      console.log("Failed to fetch orders");
    }
  };

  const categorizedOrders = {
    processing: orders.filter((order) => order.status === "processing"),
    ongoing: orders.filter((order) => order.status === "ongoing"),
    completed: orders.filter((order) => order.status === "completed"),
  };

  useEffect(() => {
    if (acceptOrder) {
      const fetchData = async () => {
        try {
          const { data } = await axios.put(
            `/api/order/update-status/${acceptOrder}`,
            { statusUpdateData: "completed" }
          );
          if (data) {
            toast.success("Order completed!");
            fetchOrders();
            setRatingModal(true);
          }
        } catch (error) {
          console.log("Update order status error", error);
        }
      };
      fetchData();
    }
  }, [acceptOrder]);

  // timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const calculateTimeLeft = useCallback(() => {
    if (!selectedOrder) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const orderDate = new Date(selectedOrder?.updatedAt); // Order date
    const targetDate = new Date(orderDate);
    targetDate.setDate(orderDate.getDate() + selectedOrder?.gig?.day); // Add days for order compilation
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (!selectedOrder) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedOrder, calculateTimeLeft]);

  return (
    <div className="p-6">
      <Helmet>
        <title>Order Status | DBAE Freelancing</title>
        <meta
          name="description"
          content="Check the status of your freelancing service orders on DBAE Freelancing. Stay updated on your project progress."
        />
        <meta
          name="keywords"
          content="DBAE Freelancing order status, check freelancing orders, track orders, freelance services tracking"
        />
      </Helmet>

      {!selectedOrder?.order_id ? (
        <>
          {Object.keys(categorizedOrders).map((status) => (
            <div key={status} className="mb-8">
              <h2 className="text-lg font-bold capitalize mb-4">
                {status} Orders
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categorizedOrders[status].map((order) => (
                  <Card
                    key={order.order_id}
                    className="w-full p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {order.gig.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Order ID: {order.order_id}
                      </span>
                    </div>
                    <img
                      src={order.gig.image}
                      alt="Gig"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      {order.gig.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-primary font-bold dark:text-blue-400">
                        ${order.amount}
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {order?.status === "processing" ? (
                          <div className="text-red-500">
                            Status: {order.status}
                          </div>
                        ) : order?.status === "ongoing" ? (
                          <div className="text-blue-500">
                            Status: {order.status}
                          </div>
                        ) : (
                          <div className="text-green-500">
                            Status: {order.status}
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full text-sm font-semibold py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
                        View Details
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex">
          <div className="flex-1 my-6 mx-5">
            <FaCircleArrowLeft
              onClick={() => setSelectedOrder({})}
              size={32}
              className="m-3 cursor-pointer animate-pulse"
            />
            <OrderChat
              setAcceptOrder={setAcceptOrder}
              selectedOrder={selectedOrder}
            />
          </div>
          <div className="flex-1 mx-[65px]">
            <div className="my-6">
              <Card>
                <h3 className="text-lg font-semibold text-center mb-6">
                  Order Details
                </h3>
                {/* timer */}
                {selectedOrder?.status === "processing" ? (
                  <div className=" text-2xl font-semibold text-red-500 text-center">
                    processing
                  </div>
                ) : selectedOrder?.status === "completed" ? (
                  <div className=" text-2xl font-semibold text-green-500 text-center">
                    Completed
                  </div>
                ) : (
                  <div className="text-center  p-6">
                    <h2 className="text-lg font-semibold mb-2">
                      Time left to deliver
                    </h2>
                    <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4">
                      <div className="flex flex-col items-center text-red-500">
                        <span className="text-xl sm:text-xl font-bold">
                          {String(timeLeft.days).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-xl text-black dark:text-white/75">
                          Days
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-red-500">
                        <span className="text-xl sm:text-xl font-bold">
                          {String(timeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-xl text-black dark:text-white/75">
                          Hours
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-red-500">
                        <span className="text-xl sm:text-xl font-bold">
                          {String(timeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-black sm:text-xl dark:text-white/75">
                          Minutes
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-red-500">
                        <span className="text-xl sm:text-xl font-bold">
                          {String(timeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-xl text-black dark:text-white/75">
                          Seconds
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  {/* Order Details */}
                  <div>
                    <strong>Order ID:</strong> {selectedOrder.order_id}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedOrder.status}
                  </div>
                  <div>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Updated At:</strong>{" "}
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </div>

                  <div>
                    <strong>Amount:</strong> ${selectedOrder.amount}
                  </div>

                  {/* Gig Details */}
                  <h4 className="col-span-2 text-lg font-semibold mt-4">
                    Gig Details
                  </h4>
                  <img
                    src={selectedOrder?.gig?.image}
                    alt="Gig"
                    className="col-span-2 w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <div className="col-span-2">
                    <strong>Title:</strong> {selectedOrder?.gig?.title}
                  </div>
                  <div>
                    <strong>Description:</strong> $
                    {selectedOrder?.gig?.description}
                  </div>
                  <div>
                    <strong>Price:</strong> ${selectedOrder?.gig?.price}
                  </div>
                  <div>
                    <strong>Delivery in:</strong> {selectedOrder?.gig?.day} days
                  </div>

                  <div className="col-span-2">
                    <strong>Packages:</strong>
                    <div className=" flex flex-col gap-3 mt-2">
                      {selectedOrder?.gig?.packages?.map((sub, index) => (
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
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <Modal show={ratingModal} onClose={() => setRatingModal(false)}>
        <Modal.Body>
          <div className="max-w-lg mx-auto p-8 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Leave a Review
            </h2>
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none transform transition duration-200 hover:scale-110">
                  <FaStar
                    className={`h-8 w-8 ${
                      star <= review.rating
                        ? "text-yellow-300"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Share your experience..."
              value={review.comment}
              onChange={(e) =>
                setReview((prevReview) => ({
                  ...prevReview,
                  comment: e.target.value,
                }))
              }
              className="mb-6 rounded-lg p-4 bg-white text-gray-900"
              rows={4}
            />
            <Button
              onClick={handleReviewSubmit}
              gradientDuoTone="purpleToBlue"
              outline
              pill
              className="w-full py-2 text-lg font-semibold transition-all duration-200 hover:shadow-xl hover:scale-105">
              Submit Review
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

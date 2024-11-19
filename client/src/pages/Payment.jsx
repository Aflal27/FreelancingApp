import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoIosPricetag } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import { Helmet } from "react-helmet-async";

export default function Payment() {
  const [orderData, setOrderData] = useState({});
  const { _id } = useSelector((state) => state.userState);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    order_id: "",
    amount: "",
    currency: "USD",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const [orderSuccessData, setOrderSuccessData] = useState({
    user: "",
    order_id: "",
    address: "",
    amount: "",
    city: "",
    country: "",
    phone: "",
    gig: {
      id: "",
      image: "",
      title: "",
      description: "",
      day: "",
      price: "",
      packages: [],
    },
  });


  useEffect(() => {
    if (state?.orderData) {
      setOrderData(state?.orderData);
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate random order ID

      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        order_id: randomNumber,
        amount: parseFloat(
          state?.orderData?.totalPrice || state?.orderData?.price
        ).toFixed(2),
      }));
    }
  }, [state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (orderData?.image && paymentDetails?.amount) {
      setOrderSuccessData({
        user: _id,
        order_id: paymentDetails?.order_id,
        address: paymentDetails?.address || "",
        amount: paymentDetails?.amount || "",
        city: paymentDetails?.city || "",
        country: paymentDetails?.country || "",
        phone: paymentDetails?.phone || "",
        gig: {
          id: orderData?.id,
          image: orderData?.image || "",
          title: orderData?.title || "",
          description: orderData?.description || "",
          day: orderData?.delivery || "",
          price: orderData?.totalPrice || orderData?.price || "",
          packages: orderData?.packages || [],
        },
      });
    }
  }, [paymentDetails, orderData]);

  const handlePayment = async () => {
    if (
      !paymentDetails?.order_id ||
      !paymentDetails?.amount ||
      !paymentDetails?.city ||
      !paymentDetails?.country ||
      !paymentDetails?.currency ||
      !paymentDetails?.email ||
      !paymentDetails?.first_name ||
      !paymentDetails?.last_name ||
      !paymentDetails?.phone ||
      !paymentDetails?.address
    ) {
      return toast.error("fill all Field ");
    }

    try {
      // Request backend to generate the hash value
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (response.ok) {
        const { hash, merchant_id } = await response.json();

        // Payment configuration
        const payment = {
          sandbox: true, // Use sandbox for testing
          merchant_id: merchant_id,
          return_url: "http://localhost:3000/payment/success", // Replace with your return URL
          cancel_url: "http://localhost:3000/payment/cancel", // Replace with your cancel URL
          notify_url: "http://localhost:3000/payment/notify", // Replace with your notify URL - This should be public IP (No Localhost)
          order_id: paymentDetails.order_id,
          items: "Item Title",
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash: hash,
        };

        // Initialize PayHere payment
        payhere.startPayment(payment);

        // After successful payment, navigate to success page
        payhere.onCompleted = function onCompleted(orderId) {
          toast.success("Payment successful!");

          const fetchData = async () => {
            setLoading(true);
            try {
              await axios.post("/api/order/create", orderSuccessData);
              setLoading(false);
            } catch (error) {
              console.log("createOrderError", error);
              setLoading(false);
            }
          };
          fetchData();

          navigate("/payment/success", {
            state: {
              order: {
                _id,
                orderId,
                orderData,
                paymentDetails,
              },
            },
          });
        };

        // Handle payment error
        payhere.onError = function onError(error) {
          toast.error("Payment failed!");
          console.error("Payment error:", error);
        };
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };



  return (
    <>
      {/* {loading && (
        <div className=" flex items-center justify-center">
          <p className=" text-4xl font-semibold">Please wait...</p>
          <Spinner />
        </div>
      )} */}
      <div>
        <Helmet>
          <title>Secure Payment | DBAE Freelancing</title>
          <meta
            name="description"
            content="Secure payment gateway for Motion Graphics, Graphic Design, Video Editing, and more on DBAE Freelancing."
          />
          <meta
            name="keywords"
            content="DBAE Freelancing payment, secure payment gateway, freelance service payment, PayHere integration, freelancing services in Sri Lanka"
          />
        </Helmet>
        <div className=" max-w-4xl mx-auto">
          <Card>
            <div className=" flex items-center gap-2">
              <div className="">
                <img
                  className=" w-[200px] h-[200px] object-contain rounded-lg"
                  src={orderData?.image}
                  alt=""
                />
              </div>

              <div className=" flex flex-col gap-3">
                <p className=" text-lg font-semibold">{orderData?.title}</p>
                <p className=" text-sm text-gray-500">
                  {orderData?.description}
                </p>
                <div className=" flex items-center gap-10">
                  <div className=" flex items-center gap-1">
                    <CiDeliveryTruck size={22} />
                    <p className=" text-sm text-gray-500">
                      {orderData?.delivery} days
                    </p>
                  </div>

                  <div className=" flex items-center gap-1">
                    <IoIosPricetag size={22} />
                    <p className=" text-sm text-gray-500">
                      $ {orderData?.totalPrice || orderData?.price}
                    </p>
                  </div>
                </div>
                <div className=" flex  gap-3 flex-wrap">
                  {orderData?.packages?.map((sub, index) => (
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

            {/* card details */}
            <div className="">
              <form className="flex max-w-md mx-auto flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="fname" value="Your First Name" />
                  </div>
                  <TextInput
                    id="fname"
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    value={paymentDetails.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="lname" value="Your Last Name" />
                  </div>
                  <TextInput
                    id="lname"
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={paymentDetails.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Your Email" />
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    name="email"
                    value={paymentDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="phone" value="Your Phone Number" />
                  </div>
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    value={paymentDetails.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="address" value="Your Address" />
                  </div>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={paymentDetails.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="city" value="Your City" />
                  </div>
                  <TextInput
                    id="city"
                    type="text"
                    placeholder="City"
                    name="city"
                    value={paymentDetails.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="country" value="Your Country" />
                  </div>
                  <TextInput
                    id="country"
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={paymentDetails.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </form>
              <Button
                className=" mx-auto mt-5"
                id="payhere-payment"
                onClick={handlePayment}
                color="blue">
                Pay Now $ {orderData?.totalPrice || orderData?.price}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

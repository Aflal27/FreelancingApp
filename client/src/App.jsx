import React, { useEffect, useState } from "react";
import Header from "./components/layout/Header";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/layout/FooterPage";
import CatGigsPage from "./pages/CatGigsPage";
import MainChat from "./components/chat/MainChat";
import { AiFillMessage } from "react-icons/ai";
import SingleGigPage from "./pages/SingleGigPage";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SingnIn";
import SingUp from "./pages/SingUp";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Payment from "./pages/Payment";
import { setOnlineUser, setSocketConnection } from "./redux/slices/userSlice";
import io from "socket.io-client";
import PaymentSuccss from "./pages/PaymentSuccss";
import Order from "./pages/Order";
import ProductedRoute from "./components/layout/ProductedRoute";
import { HelmetProvider } from "react-helmet-async";
import toast from "react-hot-toast";
import ProductedRoute2 from "./components/layout/ProductedRoute2";
import Profile from "./pages/Profile";

const retryDelay = 5000;

export default function App() {
  const { _id, role } = useSelector((state) => state.userState);
  const [openModal, setOpenModal] = useState(false);
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    fileUrl: "",
    offer: {
      id: "",
      title: "",
      image: "",
      description: "",
      delivery: 0,
      price: 0,
      packages: [],
      expire: 0,
    },
    image: "",
    price: 0,
    desc: "",
    title: "",
  });
  const [serverUp, setServerUp] = useState(true);
  const [retryInterval, setRetryInterval] = useState(retryDelay);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("/api/health-check"); // Replace with your endpoint
        setServerUp(true);
        setRetryInterval(retryDelay); // Reset interval if successful
      } catch (error) {
        setServerUp(false);
        toast.error("Server is down. Retrying...");
        setRetryInterval((prev) => prev * 2); // Exponential backoff
      }
    };

    if (!serverUp) {
      // Try reconnecting with exponential backoff
      const intervalId = setInterval(() => {
        checkServerStatus();
      }, retryInterval);

      // Clear interval once the server is back up
      return () => clearInterval(intervalId);
    }
  }, [serverUp, retryInterval]);

  // socket
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketConnection));
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="">
      <Toaster />
      <BrowserRouter>
        <HelmetProvider>
          <Header />
          <div className=" relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cat-gigs" element={<CatGigsPage />} />
              <Route
                path="/single-gig/:title"
                element={
                  <SingleGigPage
                    setMessage={setMessage}
                    setOpenModal={setOpenModal}
                    message={message}
                  />
                }
              />
              <Route
                path="/sign-in"
                element={
                  <ProductedRoute2>
                    <SignIn />
                  </ProductedRoute2>
                }
              />
              <Route
                path="/sign-up"
                element={
                  <ProductedRoute2>
                    <SingUp />
                  </ProductedRoute2>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProductedRoute>
                    <Dashboard
                      setMessage={setMessage}
                      message={message}
                      setLocation={setLocation}
                    />
                  </ProductedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProductedRoute>
                    <Payment />
                  </ProductedRoute>
                }
              />
              <Route
                path="/payment/success"
                element={
                  <ProductedRoute>
                    <PaymentSuccss />
                  </ProductedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProductedRoute>
                    <Order />
                  </ProductedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProductedRoute>
                    <Profile />
                  </ProductedRoute>
                }
              />
            </Routes>

            {role === "user" && (
              <div className="">
                <ProductedRoute>
                  <MainChat
                    message={message}
                    setMessage={setMessage}
                    setOpenModal={setOpenModal}
                    openModal={openModal}
                  />
                </ProductedRoute>
              </div>
            )}

            {!location && (
              <div className="">
                {!openModal && (
                  <div
                    onClick={() => setOpenModal(!openModal)}
                    className=" fixed bottom-16 right-8 z-20 flex items-center gap-1 m-6 bg-blue-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-300 transition-all duration-300">
                    <AiFillMessage className=" w-8 h-8 md:w-12 md:h-12 text-white" />
                    <p className=" hidden md:inline text-white text-sm">
                      Message
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <Footer />
        </HelmetProvider>
      </BrowserRouter>
    </div>
  );
}

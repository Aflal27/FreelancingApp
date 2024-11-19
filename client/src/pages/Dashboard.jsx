import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashSidebar from "../components/dashboard/DashSidebar";
import Dash from "../components/dashboard/Dash";
import AllGig from "../components/dashboard/AllGig";
import CreateCat from "../components/dashboard/category/CreateCat";
import CreateGig from "../components/dashboard/gig/CreateGig";
import Users from "../components/dashboard/Users";
import Review from "../components/dashboard/Review";
import Orders from "../components/dashboard/Orders";
import Chat from "../components/dashboard/Chat";
import {
  setOnlineUser,
  setSocketConnection,
  setToken,
  setUser,
} from "../redux/slices/userSlice";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Thubnail from "../components/dashboard/Thubnail";
import Brands from "../components/dashboard/Brands";
import Persons from "../components/dashboard/Persons";
import { Helmet } from "react-helmet-async";

export default function Dashboard({
  setLocation,
  setMessage,
  message,
  setOrder,
  order,
}) {
  const [tab, setTab] = useState("");
  // const { token } = useSelector((state) => state.userState);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/api/auth/user-details");

        if (data) {
          dispatch(setUser(data?.data?.data));
          dispatch(setToken(data?.data?.token));
          localStorage.setItem("token", data?.data?.token);
        }
      } catch (error) {
        toast.error(error);
        console.log("get-user-details-error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("tab", "dashboard");

    // Update the URL with navigate
    navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const tabFormUrl = urlParams.get("tab");
    setLocation(tabFormUrl);
    setTab(tabFormUrl);
  }, [location.search]);
  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      <Helmet>
        <title>Admin Dashboard | DBAE Freelancing</title>
        <meta
          name="description"
          content="Manage DBAE Freelancing services, orders, and clients with our user-friendly Admin Dashboard."
        />
        <meta
          name="keywords"
          content="DBAE Freelancing admin, admin dashboard, freelancing platform management, freelance services management"
        />
      </Helmet>
      <div className="">
        <DashSidebar />
      </div>

      <div className=" flex-1">
        {tab == "dashboard" && <Dash />}
        {tab == "all-gig" && <AllGig />}
        {tab == "create-cat" && <CreateCat />}
        {tab == "create-gig" && <CreateGig />}
        {tab == "users" && <Users />}
        {tab == "review" && <Review />}
        {tab == "orders" && (
          <Orders
            setMessage={setMessage}
            message={message}
            setOrder={setOrder}
            order={order}
          />
        )}
        {tab == "chat" && (
          <Chat
            setMessage={setMessage}
            message={message}
            setOrder={setOrder}
            order={order}
          />
        )}
        {tab == "thumbnail" && <Thubnail />}
        {tab == "brands" && <Brands />}
        {tab == "person" && <Persons />}
      </div>
    </div>
  );
}

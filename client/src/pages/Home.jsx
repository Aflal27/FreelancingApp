import React, { useEffect, useRef, useState } from "react";
import Thumbnail from "../components/layout/Thumbnail";
import CatagoryGigs from "../components/gigs/CatagoryGigs";
import Brands from "../components/layout/Brands";
import Founders from "../components/layout/Founders";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import Employess from "../components/layout/Employess";
import TopRating from "../components/gigs/TopRating";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/api/auth/user-details");

        if (data?.data?.data) {
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

  return (
    <div className="">
      <Helmet>
        <title>
          DBAE Freelancing | Motion Graphics, Web Development, and More
        </title>
        <meta
          name="description"
          content="DBAE Freelancing in Sri Lanka - offering expert services in Motion Graphics, Graphic Design, Video Editing, Web Development, and Digital Marketing. Find your freelancer today!"
        />
        <meta
          name="keywords"
          content="DBAE Freelancing, Motion Graphics, Graphic Design, Video Editing, Web Development, Digital Marketing, freelance services in Sri Lanka ,freelance services,freelance,DBAE "
        />
      </Helmet>
      <div className="md:p-10 rounded-full ">
        <Thumbnail />
      </div>
      <div className=" w-screen md:px-5 ">
        <CatagoryGigs />
      </div>

      <div className=" md:px-8">
        <h3 className=" text-lg font-semibold p-2">Top Rate</h3>
        <TopRating />
      </div>
      {/* brands */}
      <div className=" flex flex-col items-center mt-5">
        <p className=" text-xl md:text-4xl font-semibold text-gray-500 ">
          Trusted by top brands
        </p>
        <Brands />
      </div>
      {/* founders */}
      <div className=" mx-3">
        <div className=" flex flex-col items-center gap-10 my-24 ">
          <p className=" text-xl md:text-4xl font-semibold text-gray-500 ">
            Founders
          </p>
          <Founders />
        </div>
      </div>
      {/* Employee */}
      <div className=" mx-3 ">
        <div className=" flex flex-col items-center gap-10 my-24 ">
          <p className=" text-xl md:text-4xl font-semibold text-gray-500 ">
            Employee
          </p>
          <Employess />
        </div>
      </div>
    </div>
  );
}

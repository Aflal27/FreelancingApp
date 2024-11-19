import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { useSelector } from "react-redux";
import Avatar from "../layout/Avatar";
import { Link } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function HeaderChat({ userData }) {
  const { role } = useSelector((state) => state.userState);
  return (
    <div className="">
      {role && role === "admin" ? (
        <header className=" sticky top-0 h-16 bg-white p-2  shadow-md flex items-center gap-2 dark:bg-slate-500">
          <Link to="/" className=" cursor-pointer lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className=" flex items-center justify-center gap-2">
              <Avatar
                width={50}
                height={50}
                name={userData?.name}
                image={userData?.profile_pic}
                userId={userData?._id}
              />
              <div className="">
                <h3 className=" text-lg font-semibold my-0 text-ellipsis line-clamp-1">
                  {userData?.name}
                </h3>
                <p className=" -my-1 text-xs">
                  {userData?.online ? (
                    <span className=" text-green-600">Online</span>
                  ) : (
                    <span className=" text-slate-400">Offline</span>
                  )}
                </p>
              </div>
            </div>
            <div className=" cursor-pointer hover:text-teal-500 ">
              <HiOutlineDotsVertical size={22} />
            </div>
          </div>
        </header>
      ) : (
        <div className=" flex gap-2 dark:bg-slate-500">
          <img
            src="/images/logo.png"
            className=" w-12 h-12 rounded-full bg-slate-400"
            alt="dbae-logo"
          />
          <div className="">
            <p className=" text-lg text-gray-600">Dbae Live Chat</p>
            <div className=" flex items-center">
              <p className=" text-green-400 text-xs">Online</p>
              <div className=" flex items-center gap-1">
                <LuDot />
                <p className=" text-xs">
                  Avg response time:<span className=" ">24Hour</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

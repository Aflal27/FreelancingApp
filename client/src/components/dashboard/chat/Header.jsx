import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../../layout/Avatar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";

export default function Header({ userData }) {
  return (
    <div>
      <header className=" sticky dark:bg-slate-500 top-0 h-16 bg-white p-2  shadow-md flex items-center gap-2">
        <Link to="/" className=" cursor-pointer lg:hidden">
          <FaAngleLeft size={25} />
        </Link>
        <div className="flex items-center justify-between w-full">
          <div className=" flex items-center justify-center gap-2">
            <Avatar
              width={50}
              height={50}
              name={userData?.username}
              image={userData?.profile_pic}
              userId={userData?._id}
            />
            <div className="">
              <h3 className=" text-lg font-semibold my-0 text-ellipsis line-clamp-1">
                {userData?.username}
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
    </div>
  );
}

import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Dash() {
  return (
    <div className="">
      <h3 className=" text-xl font-semibold m-4">Dashboard</h3>
      <div className="flex items-center justify-center">
        <div className=" w-full h-[200px] bg-blue-400 rounded-xl max-w-2xl flex items-center justify-center">
          <div className=" flex flex-col items-center">
            <p className=" text-2xl font-semibold text-white">Total Amount</p>
            <p className=" text-2xl font-semibold text-white">$10000</p>
          </div>
        </div>
      </div>
      <div className=" flex items-center justify-between mx-4 gap-5 mt-10">
        <div className=" w-full h-[200px] bg-green-400 relative shadow-2xl rounded-lg">
          <div className=" flex flex-col items-center mt-10">
            <p className=" text-2xl font-semibold text-white">Gigs</p>
            <p className=" text-2xl font-semibold text-white">10</p>
          </div>
          <div className=" text-white font-semibold flex items-center justify-between px-2 shadow-md absolute  bottom-2 border-t w-full">
            <p>View details</p>
            <MdOutlineKeyboardArrowRight />
          </div>
        </div>
        <div className=" w-full  h-[200px] bg-red-400 relative shadow-2xl rounded-lg">
          <div className=" flex flex-col items-center mt-10">
            <p className=" text-2xl font-semibold text-white">Users</p>
            <p className=" text-2xl font-semibold text-white">10</p>
          </div>
          <div className=" text-white font-semibold flex items-center justify-between px-2 shadow-md absolute  bottom-2 border-t w-full">
            <p>View details</p>
            <MdOutlineKeyboardArrowRight />
          </div>
        </div>
        <div className=" w-full  h-[200px] bg-sky-400 relative shadow-2xl rounded-lg">
          <div className=" flex flex-col items-center mt-10">
            <p className=" text-2xl font-semibold text-white">Orders</p>
            <p className=" text-2xl font-semibold text-white">10</p>
          </div>
          <div className=" text-white font-semibold flex items-center justify-between px-2 shadow-md absolute  bottom-2 border-t w-full">
            <p>View details</p>
            <MdOutlineKeyboardArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}

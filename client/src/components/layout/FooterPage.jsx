import React from "react";
import { Footer } from "flowbite-react";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsGithub,
  BsDribbble,
  BsLinkedin,
} from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { IoLogoUsd } from "react-icons/io5";

export default function FooterPage() {
  return (
    <div>
      <div className=" w-screen h-12 md:h-full flex items-center justify-between px-10 bg-white shadow-md dark:bg-gray-700">
        <div className=" hidden md:inline">
          <img
            className=" w-8 h-8 md:w-[100px] md:h-[100px]"
            src="/images/logo.png"
            alt="logo"
          />
        </div>
        <div className=" flex items-center gap-1">
          <AiOutlineCopyrightCircle className=" w-2 h-2 md:w-5 md:h-5" />
          <p className=" hidden md:inline text-xs md:text-lg font-semibold">
            Dbae International Ltd. 2024
          </p>
          <p className=" md:hidden text-xs md:text-lg font-semibold">
            Dbae Ltd. 2024
          </p>
        </div>
        <div className=" hidden  md:flex items-center gap-2 md:gap-6 ">
          <BsFacebook className=" md:w-6 md:h-6 hover:text-gray-400 transition-all duration-300" />
          <BsInstagram className=" md:w-6 md:h-6 hover:text-gray-400 transition-all duration-300" />
          <BsTwitter className=" md:w-6 md:h-6 hover:text-gray-400 transition-all duration-300" />
          <BsLinkedin className=" md:w-6 md:h-6 hover:text-gray-400 transition-all duration-300" />
          <FaTiktok className=" md:w-6 md:h-6 hover:text-gray-400 transition-all duration-300" />
        </div>
        <div className=" flex items-center gap-1">
          <GrLanguage />
          <p className=" hidden md:inline text-sm md:text-lg font-semibold">
            English
          </p>
          <p className=" md:hidden text-xs font-semibold">En</p>
        </div>
        <div className=" flex items-center gap-1">
          <IoLogoUsd />
          <p className=" text-xs font-semibold md:text-lg">USD</p>
        </div>
      </div>
    </div>
  );
}

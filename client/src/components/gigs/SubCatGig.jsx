import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import GigCard from "../card/GigCard";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";

export default function SubCatGig({ title }) {
  const number = [1, 2, 3, 4, 5, 6, 7, 9];

  return (
    <div>
      <p className=" text-lg font-semibold p-2">{title}</p>
      <div className="container mx-auto ">
        <Swiper
          className=""
          // Enable Navigation Arrows
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          // Enable Pagination

          // Import modules
          modules={[Navigation]}
          // Define how many slides to show per view
          //slidesPerView={3} // This shows 3 slides at a time
          // spaceBetween={5} // Spacing between each slide
          breakpoints={{
            // Breakpoints for responsive design
            320: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 1,
            },
          }}>
          {/* custom navigation btns */}
          <div className="p-3 mt-3 flex items-center justify-between">
            <div className=" ">
              <button className="custom-prev ">
                <IoIosArrowDropleft className=" w-8 h-8 md:w-10 md:h-10 hover:text-gray-400 transition-all duration-300" />
              </button>
              <button className="custom-next">
                <IoIosArrowDropright className=" w-8 h-8 md:w-10 md:h-10 hover:text-gray-400  transition-all duration-300" />
              </button>
            </div>
            <Link
              to="/cat-gigs"
              className="  text-blue-600 hover:text-blue-300 transition-all duration-300 text-md cursor-pointer">
              More...
            </Link>
          </div>
          {/* Swiper Slides */}
          {number.map((index) => (
            <SwiperSlide key={index}>
              <GigCard />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className=" "></div>
      </div>
    </div>
  );
}

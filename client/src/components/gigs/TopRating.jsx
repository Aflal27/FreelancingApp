import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import GigCard from "../card/GigCard";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TopRating() {
  const [ratingData, setRatingData] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/gig/rating");

        setRatingData(data?.gigs);
      } catch (error) {
        console.log("ratingError", error);
      }
    };
    fetchData();
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);

  // Check for screen width on mount and resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMoreBtn = () => {
    navigation("/cat-gigs", {
      state: {
        title: "top-rate",
      },
    });
  };
  return (
    <div>
      <div className="">
        <div className="w-full overflow-hidden relative">
          <div className="container mx-auto py-6 mb-4">
            <Swiper
              modules={[Navigation]}
              navigation={
                isDesktop
                  ? {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }
                  : false
              }
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="relative">
              {ratingData?.map((gig, index) => (
                <SwiperSlide key={index}>
                  <GigCard gigData={gig} />
                </SwiperSlide>
              ))}
              {ratingData.length === 0 && (
                <p className="text-red-500 text-center font-semibold text-lg mt-4">
                  Not Available!
                </p>
              )}

              {/* Custom Next Arrow */}
              <div className="swiper-button-next hidden lg:flex justify-center items-center w-10 h-10 bg-opacity-50 bg-gray-700 text-white rounded-full shadow-lg absolute top-1/2 right-2 transform -translate-y-1/2 hover:bg-opacity-80 hover:scale-105 transition duration-300 ease-in-out">
                <FaChevronRight size={20} />
              </div>

              {/* Custom Previous Arrow */}
              <div className="swiper-button-prev hidden lg:flex justify-center items-center w-10 h-10 bg-opacity-50 bg-gray-700 text-white rounded-full shadow-lg absolute top-1/2 left-2 transform -translate-y-1/2 hover:bg-opacity-80 hover:scale-105 transition duration-300 ease-in-out">
                <FaChevronLeft size={20} />
              </div>
            </Swiper>
          </div>

          {/* "More" Button */}
          {ratingData?.length >= 5 && (
            <div className="absolute bottom-4 right-4 ">
              <button
                onClick={handleMoreBtn}
                className="text-blue-600 hover:text-blue-400 transition duration-300 font-semibold">
                More...
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

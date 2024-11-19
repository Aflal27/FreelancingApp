import React, { useEffect, useState } from "react";
import { mainCat } from "../../utils/mainCat";
import GigCard from "../card/GigCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
// import "swiper/swiper-bundle.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CatagoryGigs() {
  const [categories, setCategories] = useState([]);
  const [searchData, setSearchData] = useState("Motion graphic");
  const [gigsData, setgGigsData] = useState([]);
  const navigation = useNavigate();
  const [loadingGig, setLoadingGig] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/all-main-sub");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchData) return;
      setLoadingGig(true);
      try {
        const { data } = await axios.get(
          `/api/gig/search-to-get-gigs/${searchData}`
        );
        setLoadingGig(false);

        setgGigsData(data);
      } catch (error) {
        console.log("search-to-get-gigs-error", error);
        setLoadingGig(false);
      }
    };

    fetchData();
  }, [searchData]);

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
        title: searchData,
      },
    });
  };

  // scroller
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Handler to hide the scroll hint on scroll
  const handleScroll = (event) => {
    if (event.target.scrollTop > 0) {
      setShowScrollHint(false);
    }
  };

  // Re-show the hint when the user navigates back to the section
  useEffect(() => {
    setShowScrollHint(true);
  }, [categories]);
  return (
    <div className="md:mx-5 px-4">
      <div className="md:flex items-start gap-6">
        {/* Gig Category Section */}
        <div className="relative mx-3 md:mx-0">
          {/* Scroll Indicators */}
          <div className=" hidden md:inline absolute top-0 left-0 h-full w-3 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-800 pointer-events-none z-10"></div>
          <div className="hidden md:inline  absolute top-0 right-0 h-full w-3 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-800 pointer-events-none z-10"></div>

          {/* Scrollable Container */}
          <div
            className="flex md:flex-col gap-3 md:h-[250px] overflow-auto no-scrollbar"
            onScroll={handleScroll}>
            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => setSearchData(cat?.main)}
                className="cursor-pointer mb-3 flex-shrink-0">
                <div className="flex md:flex-col items-center gap-3 p-2 w-[150px] md:w-[200px] rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition duration-300 ease-in-out">
                  <img
                    className="w-16 h-16 md:w-20 md:h-20 object-contain dark:brightness-150 dark:invert"
                    src={cat?.logo}
                    alt={cat?.main}
                  />
                  <p className="text-sm font-bold  text-center mt-2">
                    {cat?.main}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Hint */}
          {showScrollHint && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 md:mt-4 animate-pulse">
              Scroll to explore categories →
            </p>
          )}
        </div>

        {/* Gigs Section */}
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
              {gigsData?.map((gig, index) => (
                <SwiperSlide key={index}>
                  <GigCard gigData={gig} />
                </SwiperSlide>
              ))}

              {gigsData?.length === 0 && (
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
          {gigsData?.length >= 5 && (
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

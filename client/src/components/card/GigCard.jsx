import React from "react";
import { Card } from "flowbite-react";
// import Swiper core and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function GigCard({ gigData }) {
  SwiperCore.use([Navigation]);
  const navigation = useNavigate();

  const handleNavigate = () => {
    navigation(`/single-gig/${gigData?.title}`, {
      state: {
        gigData,
      },
    });
  };
  console.log(gigData);

  const averageRating =
    gigData?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
      gigData?.reviews?.length || 0;

  return (
    <div>
      <div className="max-w-xs bg-slate-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 relative">
        {/* Header with Swiper */}
        <Swiper navigation>
          {gigData?.videos?.map((v, index) => (
            <SwiperSlide key={index}>
              <video
                src={v}
                muted
                autoPlay
                loop
                className="rounded-t-lg"></video>
            </SwiperSlide>
          ))}
          {gigData?.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={gigData?.title}
                className="object-contain rounded-t-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Description and rating */}
        <div onClick={handleNavigate} className="p-3 flex flex-col gap-2">
          <p className="text-sm line-clamp-1 md:line-clamp-2 hover:text-blue-500">
            {gigData?.title}
          </p>

          {/* Average Rating */}
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>
              {averageRating.toFixed(1)} ({gigData?.reviews?.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold">From</p>
            <span>${gigData?.base?.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

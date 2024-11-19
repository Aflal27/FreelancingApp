import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/api/brand/get");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);
  return (
    <div className=" w-screen px-6 md:max-w-2xl mx-auto overflow-hidden">
      <Swiper
        slidesPerView={4}
        loop={true} // Enables infinite looping
        autoplay={{
          delay: 2500, // Delay between transitions (in ms)
          disableOnInteraction: false, // Continue autoplay even after interaction
        }}
        // Add navigation arrows
        modules={[Autoplay]} // Import the required modules
      >
        {brands.map((b, index) => (
          //   <SwiperSlide>
          //     <img width={100} height={100} src={b.img} alt="brands" />
          //   </SwiperSlide>
          <SwiperSlide key={index}>
            <div className="w-[50px] h-[50px] md:w-[200px] md:h-[200px]  flex items-center justify-center">
              <img
                className=" dark:brightness-[200%] dark:invert-[100%]"
                width={100}
                height={100}
                src={b?.brandImage}
                alt="brands"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

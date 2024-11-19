import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import { Card } from "flowbite-react";
import "swiper/css";
import "swiper/css/navigation";

export default function Employees() {
  const [person, setPerson] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("/api/person/get-all-person");
        setPerson(data);
      } catch (error) {
        console.log("Error fetching persons:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 lg:px-20">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}>
          {person.map((f, index) =>
            f?.type === "Employee" ? (
              <SwiperSlide key={index}>
                <div className=" flex flex-col items-center">
                  <div className="relative w-[200px] h-[200px] overflow-hidden">
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {f.name}
                    </h3>
                    <p className="text-md font-medium text-gray-600 dark:text-gray-400">
                      {f.position}
                    </p>
                    {/* <div className="mt-4">
                      <ul className="mt-2">
                        {f.responsibilities.map((respos, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <IoMdArrowDropright
                              size={16}
                              className="mr-2 text-primary dark:text-blue-400"
                            />
                            {respos}
                          </li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                </div>
              </SwiperSlide>
            ) : null
          )}
        </Swiper>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import axios from "axios";

export default function Founders() {
  const [person, setPerson] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("/api/person/get-all-person");
        setPerson(data);
      } catch (error) {
        console.log("Error fetching persons: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {person?.map(
          (f, index) =>
            f?.type === "Founder" && (
              <div key={index} className=" flex flex-col items-center gap-4">
                {/* Image with angled style */}
                <div className="relative w-[200px] h-[200px] overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {f.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {f.position}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {f.description}
                  </p>

                  {/* Responsibilities List */}
                  {/* <div className="mt-4">
                    <ul>
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
            )
        )}
      </div>
    </div>
  );
}

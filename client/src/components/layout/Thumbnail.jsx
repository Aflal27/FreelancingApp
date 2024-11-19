import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export default function Thumbnail() {
  const [thumbData, setThumbData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThumbnails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/thumb/get");
        if (data) {
          setThumbData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to load thumbnails", error);
        setLoading(false);
      }
    };
    fetchThumbnails();
  }, []);
  return (
    <div className="">
      <div className="container mx-auto px-1 py-1 bg-slate-300 dark:bg-slate-600 rounded-lg">
        {/* Responsive Grid for 3 Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {/* Video 1 */}
          <div className="w-[100%] h-auto">
            <video
              className=" rounded-md"
              src={thumbData?.thumbnail01}
              autoPlay
              loop
              muted></video>
          </div>

          {/* Video 2 */}
          <div className=" hidden md:inline w-full h-auto">
            <video
              className=" rounded-md"
              src={thumbData?.thumbnail02}
              autoPlay
              loop
              muted></video>
          </div>

          {/* Video 3 */}
          <div className=" hidden md:inline w-full h-auto">
            <video
              className=" rounded-md"
              src={thumbData?.thumbnail03}
              autoPlay
              loop
              muted></video>
          </div>
        </div>
      </div>
    </div>
  );
}

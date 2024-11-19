import React, { useEffect, useState } from "react";
import GigCard from "../components/card/GigCard";
import { Dropdown } from "flowbite-react";
import { FaHome } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

export default function CatGigsPage() {
  const [gigData, setGigData] = useState([]);
  const { state } = useLocation();
  const [subCatData, setSubCatData] = useState([]);
  const [subCat, setSubCat] = useState("");
  const [mainCat, setMainCat] = useState("");

  useEffect(() => {
    if (state?.gigData) {
      setGigData(state.gigData);
    }
    if (state?.title) {
      setMainCat(state?.title);
    }
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      let mainCatData = gigData[0]?.mainCat;
      if (mainCatData) {
        try {
          const { data } = await axios.post("/api/category/get-sub", {
            mainCatData,
          });
          setSubCatData(data?.catSub);
        } catch (error) {
          console.log("getSubCatError", error);
          toast.error(error);
        }
      }
    };
    fetchData();
  }, [gigData]);

  useEffect(() => {
    const fetchData = async () => {
      // Ensure we proceed only when subCat or mainCat is defined
      if (!subCat && !mainCat) return;

      try {
        if (subCat) {
          const { data } = await axios.get(
            `/api/gig/search-to-get-gigs/${subCat}`
          );
          if (data) {
            setGigData(data);
          }
        } else if (mainCat) {
          const { data } = await axios.get(
            `/api/gig/search-to-get-gigs/${mainCat}`
          );
          if (data) {
            setGigData(data);
          }
        }
      } catch (error) {
        console.log("search-to-get-gigs-error", error);
      }
    };

    fetchData();
  }, [subCat, mainCat]);

  useEffect(() => {
    if (state?.title === "top-rate") {
      const fetchData = async () => {
        try {
          const { data } = await axios.get("/api/gig/rating");

          setGigData(data?.gigs);
        } catch (error) {
          console.log("ratingError", error);
        }
      };
      fetchData();
    }
  }, [state?.title]);

  return (
    <div className=" m-2 md:m-12">
      <Helmet>
        <title>{`Our Services | DBAE Freelancing - ${
          gigData[0]?.mainCat || ""
        }`}</title>
        <meta
          name="description"
          content={`Explore ${
            gigData[0]?.mainCat || "various"
          } services at DBAE Freelancing, including top freelancers for your projects.`}
        />
        <meta
          name="keywords"
          content={`DBAE Freelancing, ${
            gigData[0]?.mainCat || "freelancing"
          } services, freelancing categories, Sri Lanka freelancers`}
        />
      </Helmet>
      <div className=" flex items-center gap-2">
        <FaHome size={22} />

        <p className=" text-2xl font-semibold text-gray-500">
          {gigData[0]?.mainCat}
        </p>
        <p className=" text-2xl font-semibold text-gray-500">
          /{gigData[0]?.subCat}
        </p>
      </div>
      <div className="  bg-white dark:bg-slate-500 p-3 mt-5 mb-5 w-[100px] rounded-lg border border-slate-500 ">
        <Dropdown label="Filter" inline dismissOnClick={false}>
          {subCatData?.map((cat) => (
            <Dropdown.Item onClick={() => setSubCat(cat)}>{cat}</Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4  ">
        {gigData?.map((gig, index) => (
          <GigCard gigData={gig} />
        ))}
      </div>
    </div>
  );
}

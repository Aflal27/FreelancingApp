import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownHeader,
  MegaMenu,
  Navbar,
  TextInput,
} from "flowbite-react";
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import axios from "axios";
import { logout, setToken, setUser } from "../../redux/slices/userSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.themeState);
  const user = useSelector((state) => state.userState);
  const [categories, setCategories] = useState([]);
  const [searchData, setSearchData] = useState("");
  const navigation = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [pathName, setPathName] = useState("");
  const location = useLocation();
  const [searchToggle, setSearchToggle] = useState(false);
  const [subCat, setSubCat] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (location?.pathname) {
      setPathName(location?.pathname);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/api/auth/user-details");

        if (data) {
          dispatch(setUser(data?.data?.data));
          dispatch(setToken(data?.data?.token));
          localStorage.setItem("token", data?.data?.token);
        }
      } catch (error) {
        toast.error(error);
        console.log("get-user-details-error", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/gig/search?query=${searchQuery}`);

      if (response.data) {
        navigation("/cat-gigs", {
          state: {
            gigData: response?.data,
          },
        });
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchData) return; // Ensure searchData is not empty
      try {
        const { data } = await axios.get(
          `/api/gig/search-to-get-gigs/${searchData}`
        );

        if (data) {
          navigation("/cat-gigs", {
            state: {
              gigData: data,
            },
          });
        }
      } catch (error) {
        console.log("search-to-get-gigs-error", error);
      }
    };

    fetchData();
  }, [searchData]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        dispatch(logout());
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("logout-error", error);
    }
  };

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

  return (
    <div className=" w-screen">
      <Navbar>
        {/* logo */}
        <Link to="/" className="">
          <img className="" src="/images/logo.png" width={80} alt="" />
        </Link>
        {/* search bar */}
        <div className=" flex items-center justify-center gap-2">
          <div className=" hidden lg:inline">
            <div className="flex items-center gap-3 border border-gray-400 px-3 rounded-full w-[500px] h-12">
              <Dropdown className="" label="All items" inline>
                {categories?.map((cat, index) => (
                  <Dropdown.Item
                    onClick={() => setSearchData(cat?.main)}
                    key={index}>
                    {cat?.main}
                  </Dropdown.Item>
                ))}
              </Dropdown>
              <div className=" border border-r border-gray-400 h-8"></div>
              <div className="flex items-center">
                <IoSearchOutline className="h-full" size={22} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search..."
                  className=" hidden bg-transparent  lg:inline border-none outline-none"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className=" hidden lg:inline px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            Search
          </button>
        </div>

        <Button
          onClick={() => setSearchToggle(!searchToggle)}
          className="w-12 h-10 lg:hidden "
          color="gray"
          pill>
          <IoSearchOutline />
        </Button>

        {/* user profile */}
        <div className=" flex items-center gap-2">
          {/* theme btn */}

          <Button
            onClick={() => dispatch(toggleTheme())}
            className="w-12 h-10  "
            color="gray"
            pill>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>

          {user._id && user ? (
            <Dropdown
              inline
              label={
                <Avatar
                  name={user?.username}
                  image={user?.profile_pic}
                  width={40}
                  height={40}
                />
              }>
              <Dropdown.Header>
                <span className=" block text-sm">@{user?.username}</span>
                <span className=" block text-sm">@{user?.email}</span>
              </Dropdown.Header>
              <Link to="/profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Link to="/order">
                <Dropdown.Item>Your Order</Dropdown.Item>
              </Link>
              {user?.role === "admin" && (
                <Link to="/dashboard?tab=dashboard">
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
              )}

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </Navbar>
      {pathName !== "/dashboard" &&
        pathName !== "/sign-in" &&
        pathName !== "/sign-up" && (
          <div className=" hidden md:flex items-center justify-center">
            <div className=" max-w-6xl dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-700">
              <Swiper
                slidesPerView={4}
                navigation={true}
                modules={[Navigation]}
                className="flex items-center px-4">
                {categories.map((cat, index) => (
                  <SwiperSlide
                    key={index}
                    className="text-gray-800 flex items-center gap-8 dark:text-gray-200 text-sm font-semibold cursor-pointer hover:text-blue-500 transition-colors duration-200 ease-in-out">
                    <p
                      onMouseEnter={() => {
                        setSubCat(
                          categories?.filter((c) => c?.main === cat?.main)
                        );
                        setIsHovered(true);
                      }}
                      onMouseLeave={() => setIsHovered(false)}
                      className="hover:scale-105 transform transition-transform duration-200">
                      {cat?.main}
                    </p>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Styled Subcategory Dropdown */}
              <div
                className="grid grid-cols-3 gap-4 p-4 "
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setSubCat([]);
                }}>
                {subCat &&
                  subCat[0]?.sub?.map((s, i) => (
                    <p
                      key={i}
                      onClick={() => {
                        /* handle click on subcategory item */
                        setSearchData(s);
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-500 cursor-pointer transition-colors duration-200 ease-in-out">
                      {s}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}

      {searchToggle && (
        <div className="">
          <div className=" lg:hidden p-4 w-full flex justify-center">
            <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-2">
              <TextInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-none focus:ring-0"
              />
              <Button
                onClick={handleSearch}
                color="blue"
                className="ml-2 p-2"
                pill>
                <FaSearch className="text-white text-lg" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

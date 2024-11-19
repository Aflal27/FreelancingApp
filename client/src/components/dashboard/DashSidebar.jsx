import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { FaChartPie } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { IoCreate } from "react-icons/io5";
import { MdCreateNewFolder } from "react-icons/md";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { VscPreview } from "react-icons/vsc";
import { TbShoppingCartCheck } from "react-icons/tb";
import { CiChat1 } from "react-icons/ci";
import { MdVideoLibrary } from "react-icons/md";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { BsPersonBadge } from "react-icons/bs";

export default function DashSidebar() {
  const [hanleBtn, setHanleBtn] = useState(false);
  return (
    <Sidebar className=" w-full md:w-[56]">
      <Sidebar.Items>
        <Sidebar.ItemGroup className=" flex flex-col gap-1">
          <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <FaChartPie />
                <p>Dashboard</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Sidebar.Item>
            <div
              onClick={() => setHanleBtn(!hanleBtn)}
              className=" flex items-center gap-5 ">
              <LuGalleryVerticalEnd />
              <p>Gigs</p>
              <IoIosArrowDown />
            </div>
          </Sidebar.Item>
          {hanleBtn && (
            <div className="">
              <Link to="/dashboard?tab=all-gig">
                <Sidebar.Item>
                  <div className=" flex items-center gap-1">
                    <AiFillProduct />
                    All Gig
                  </div>
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=create-gig">
                <Sidebar.Item>
                  <div className=" flex items-center gap-1">
                    <IoCreate />
                    Create Gig
                  </div>
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=create-cat">
                <Sidebar.Item>
                  <div className=" flex items-center gap-1">
                    <MdCreateNewFolder />
                    Create Category
                  </div>
                </Sidebar.Item>
              </Link>
            </div>
          )}
          <Link to="/dashboard?tab=users">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <FiUsers />
                <p>Users</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=review">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <VscPreview />
                <p>Review</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=orders">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <TbShoppingCartCheck />
                <p>Orders</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=chat">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <CiChat1 />
                <p>Chat</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=thumbnail">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <MdVideoLibrary />
                <p>Thumbnail</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=brands">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <MdOutlineBrandingWatermark />
                <p>Brands</p>
              </div>
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=person">
            <Sidebar.Item>
              <div className=" flex items-center gap-2">
                <BsPersonBadge />
                <p>Persons</p>
              </div>
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

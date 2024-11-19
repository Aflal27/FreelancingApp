import {
  Card,
  Tabs,
  Textarea,
  TextInput,
  Select,
  Label,
  Button,
  Table,
  Modal,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { IoImageOutline } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";

// react quil

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Overview from "./Overview";
import Pricing from "./Pricing";
import Description from "./Description";
import Requirment from "./Requirment";
import axios from "axios";
import Gallery from "./Gallery";

export default function UpdateGig({
  singleGigdata,
  updateGigId,
  setUpdateGigModal,
}) {
  const [openModalReq, setOpenModalReq] = useState(false);
  const [subCatData, setSubCatData] = useState("");
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (singleGigdata) {
      setFormData({
        ...singleGigdata,
      });
    }
  }, [singleGigdata]);

  const [formData, setFormData] = useState({
    title: "",
    mainCat: "",
    subCat: "",
    status: "",
    base: {
      title: "",
      description: "",
      price: 0,
      delivery: 0,
      packages: [],
    },
    silver: {
      title: "",
      description: "",
      price: 0,
      delivery: 0,
      packages: [],
    },
    platinum: {
      title: "",
      description: "",
      price: 0,
      delivery: 0,
      packages: [],
    },
    description: "",
    images: [],
    videos: [],
    extraPackage: [{}],
  });

  const [handleTabsBtn, setHandleTabsBtn] = useState({
    overview: true,
    price: false,
    desc: false,
    gal: false,
  });

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const { data } = await axios.get("/api/category/get-main");
    setCategory(data);
  };

  const handleTab = (data) => {
    if (data == "price") {
      setHandleTabsBtn({
        ...handleTabsBtn,
        price: false,
      });
    }
    if (data == "desc") {
      setHandleTabsBtn({
        ...handleTabsBtn,
        desc: false,
      });
    }
    if (data == "req") {
      setHandleTabsBtn({
        ...handleTabsBtn,
        req: false,
      });
    }
    if (data == "gal") {
      setHandleTabsBtn({
        ...handleTabsBtn,
        gal: false,
      });
    }
  };

  const handleSubCat = () => {
    if (subCatData) {
      setFormData({
        ...formData,
        sub: formData.sub.concat(subCatData),
      });
      setSubCatData("");
    }
  };

  const handleDelete = (data) => {
    if (data) {
      setFormData({
        ...formData,
        sub: formData.sub.filter((d) => d !== data),
      });
    }
  };

  return (
    <div>
      <div className=" ">
        <div className=" flex items-center gap-5 m-5">
          <button
            className={`${
              handleTabsBtn?.overview && " text-green-500 underline"
            }`}
            title="Overview">
            Overview
          </button>
          <button
            className={`${handleTabsBtn?.price && " text-green-500 underline"}`}
            title="Price">
            Price
          </button>
          <button
            className={`${handleTabsBtn?.desc && " text-green-500 underline"}`}
            title="Description">
            Description
          </button>

          <button
            className={`${handleTabsBtn?.gal && " text-green-500 underline"}`}
            title="Gallery">
            Gallery
          </button>
        </div>

        <div className="">
          {handleTabsBtn?.overview && (
            <Overview
              category={category}
              setFormData={setFormData}
              formData={formData}
              setHandleTabsBtn={setHandleTabsBtn}
              handleTabsBtn={handleTabsBtn}
            />
          )}
          {handleTabsBtn?.price && (
            <Pricing
              formData={formData}
              setFormData={setFormData}
              setHandleTabsBtn={setHandleTabsBtn}
              handleTabsBtn={handleTabsBtn}
            />
          )}
          {handleTabsBtn?.desc && (
            <Description
              formData={formData}
              setFormData={setFormData}
              setHandleTabsBtn={setHandleTabsBtn}
              handleTabsBtn={handleTabsBtn}
            />
          )}
          {handleTabsBtn?.gal && (
            <Gallery
              updateGigId={updateGigId}
              formData={formData}
              setFormData={setFormData}
              setHandleTabsBtn={setHandleTabsBtn}
              handleTabsBtn={handleTabsBtn}
              setUpdateGigModal={setUpdateGigModal}
            />
          )}
        </div>
      </div>
      {/* modal */}
      <div className="">
        <Modal
          show={openModalReq}
          onClose={() => setOpenModalReq(!openModalReq)}>
          <Modal.Header>Create</Modal.Header>
          <Modal.Body>
            <form className=" flex flex-col gap-3">
              <label className="">
                <p className=" text-lg font-semibold mb-2">Add question:</p>
                <TextInput
                  value={formData.main}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                  placeholder="enter..."
                />
              </label>

              <label>
                <p className=" text-lg font-semibold mb-2">
                  Get it in a form of:
                </p>
                <Select>
                  <option>Free Text</option>
                  <option>Multiple choice</option>
                </Select>
              </label>
            </form>

            <Modal.Footer className="">
              <Button
                onClick={() => setOpenModalReq(false)}
                className=" w-full "
                color="success">
                Add
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

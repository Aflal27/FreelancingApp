import {
  Modal,
  Select,
  Table,
  TextInput,
  Label,
  Button,
  Spinner,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { uploadFileCloud } from "../../../helpers/uploadFileCloud";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateCat({
  openUpdateModal,
  setOpenUpdateModal,
  updateId,
}) {
  const [formData, setFormData] = useState({
    main: "",
    sub: [],
    images: [],
    logo: "",
    packages: [
      {
        pack: "",
        option: "",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (updateId) {
        const { data } = await axios.get(
          `/api/category/single-get/${updateId}`
        );
        data.map((d) => {
          setFormData({
            ...d,
          });
        });
      }
    };
    fetchData();
  }, [updateId, openUpdateModal]);

  const [subCatData, setSubCatData] = useState("");
  const [packageData, setPackageData] = useState("");
  const [packageOptionData, setPackageOptionData] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleLogo = async (e) => {
    setLogoLoading(true);
    const file = e.target.files[0];
    const upload = await uploadFileCloud(file);
    setFormData((preve) => {
      return {
        ...preve,
        logo: upload?.url,
      };
    });
    setLogoLoading(false);
  };
  const handleBanner = async (e) => {
    setBannerLoading(true);
    const file = e.target.files[0];
    const upload = await uploadFileCloud(file);
    setFormData((preve) => {
      return {
        ...preve,
        images: formData.images.concat(upload?.url),
      };
    });
    setBannerLoading(false);
  };

  const handleSubCat = () => {
    if (subCatData) {
      setFormData({
        ...formData,
        sub: formData?.sub?.concat(subCatData),
      });
      setSubCatData("");
    }
  };

  const handleLogoDelete = () => {
    setFormData((preve) => {
      return {
        ...preve,
        logo: "",
      };
    });
  };

  const handlePackage = () => {
    if (packageData) {
      setFormData({
        ...formData,
        packages: [
          ...formData?.packages,
          {
            pack: packageData,
            option: packageOptionData,
          },
        ],
      });
      setPackageData("");
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
  const handleDeletePackage = (data) => {
    if (data) {
      setFormData({
        ...formData,
        packages: formData.packages.filter((pack) => pack.pack !== data),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (updateId) {
        if (confirm(" do you want update!") === true) {
          const { data } = await axios.put(
            `/api/category/update/${updateId}`,
            formData
          );
          toast.success(data);
          setSubmitLoading(false);
          setOpenUpdateModal(false);
        }
      }
    } catch (error) {
      console.log("categorySubmitError", error);
      setSubmitLoading(false);
      toast.error(error);
    }
  };
  return (
    <div>
      <Modal
        show={openUpdateModal}
        onClose={() => setOpenUpdateModal(!openUpdateModal)}>
        <Modal.Header>Update</Modal.Header>
        <Modal.Body>
          <form className=" ">
            {/* logo */}
            <label htmlFor="logo">
              <div className=" mb-3">
                <h3 className=" text-lg font-semibold mb-2">Upload Logo:</h3>
                {logoLoading ? (
                  <Spinner />
                ) : formData?.logo ? (
                  <div className=" flex items-center gap-5">
                    <img
                      src={formData?.logo}
                      className=" w-[150px] h-[150px] object-contain"
                      alt="logo"
                    />
                    <button className=" bg-red-500 text-white rounded p-1">
                      <MdDelete onClick={handleLogoDelete} size={30} />
                    </button>
                  </div>
                ) : (
                  <div className=" ">
                    <FaRegImage className=" w-[80px] h-[80px] bg-slate-100 p-2 rounded cursor-pointer" />
                  </div>
                )}
              </div>
              <input
                onChange={handleLogo}
                type="file"
                id="logo"
                accept="image/*"
                hidden
                disabled={setLogoLoading}
              />
            </label>
            {/* banner */}
            <label htmlFor="banner">
              <div className=" flex items-center gap-10">
                <h3 className=" text-lg font-semibold ">Upload Banner:</h3>
                {bannerLoading ? (
                  <Spinner />
                ) : (
                  <div className=" flex items-center gap-1 mr-10 cursor-pointer hover:opacity-25 transition-all duration-300">
                    <CiCirclePlus size={30} />
                    <p className=" text-lg font-semibold">New</p>
                  </div>
                )}
              </div>

              <input
                onChange={handleBanner}
                type="file"
                id="banner"
                accept="image/*"
                hidden
              />
            </label>
            <div className=" flex items-center justify-between">
              {formData?.images?.map((img, index) => (
                <div key={index} className=" flex flex-col items-center ">
                  <img
                    src={img}
                    className=" w-[100px] h-[100px] object-contain"
                    alt="banner"
                  />
                  <button
                    className=" bg-red-500 text-white
                     rounded p-1">
                    <MdDelete size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className=" flex flex-col gap-3 mt-4">
              <label className="">
                <p className=" text-lg font-semibold mb-2">Main Category:</p>
                <TextInput
                  value={formData?.main}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      main: e.target.value,
                    })
                  }
                  required
                  placeholder="enter category"
                />
              </label>
              <div className=" flex items-center justify-between gap-4">
                <label className="">
                  <p className=" text-lg font-semibold mb-2">Sub Category:</p>
                  <div className=" flex items-center gap-5">
                    <TextInput
                      value={subCatData}
                      onChange={(e) => setSubCatData(e.target.value)}
                      placeholder="enter category"
                    />
                    {subCatData && formData.main ? (
                      <Button onClick={handleSubCat}>Add</Button>
                    ) : (
                      <Button disabled onClick={handleSubCat}>
                        Add
                      </Button>
                    )}
                  </div>
                </label>
                <label className="">
                  <p className=" text-lg font-semibold mb-2">Packages:</p>
                  <div className=" flex items-center gap-5">
                    <TextInput
                      value={packageData}
                      onChange={(e) => setPackageData(e.target.value)}
                      required
                      placeholder="enter packages"
                    />
                    <Select
                      onClick={(e) => setPackageOptionData(e.target.value)}>
                      <option>Select</option>
                      <option value="check">Checkbox</option>
                      <option value="number">Number</option>
                      <option value="unlimited">Unlimited</option>
                    </Select>
                    {packageData && formData?.main ? (
                      <Button onClick={handlePackage}>Add</Button>
                    ) : (
                      <Button disabled>Add</Button>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div className=" flex  justify-between">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Sub Category</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {formData?.sub?.map((data, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <p>{data}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() => handleDelete(data)}
                          className=" bg-red-500 text-white rounded p-1">
                          <MdDelete size={30} />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              <Table className=" mt-8">
                <Table.Head>
                  <Table.HeadCell>Packages</Table.HeadCell>
                  <Table.HeadCell>Option</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {formData?.packages?.map((data, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <p>{data.pack}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{data.option}</p>
                      </Table.Cell>
                      <Table.Cell>
                        {data?.pack && (
                          <button
                            onClick={() => handleDeletePackage(data.pack)}
                            className=" bg-red-500 text-white rounded p-1">
                            <MdDelete size={30} />
                          </button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            <Button
              disabled={submitLoading}
              onClick={handleSubmit}
              className=" w-full "
              color="success">
              {submitLoading ? (
                <div className=" flex items-center gap-3">
                  <Spinner />
                  <p>Updating...</p>
                </div>
              ) : (
                <p>Update</p>
              )}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import { Modal, Select, Table, TextInput, Label, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegImage } from "react-icons/fa6";
import CreateCatModal from "./CreateCatModal";
import axios from "axios";
import UpdateCat from "./UpdateCat";
import toast from "react-hot-toast";

export default function CreateCat() {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [category, setCategory] = useState([]);
  const [catData, setCatData] = useState(null);
  const [updateId, setUpdateId] = useState("");

  useEffect(() => {
    fetchData();
  }, [catData, openUpdateModal]);
  const fetchData = async () => {
    const { data } = await axios.get("/api/category/get");

    setCategory(data);
  };

  const deleteCat = async (id) => {
    try {
      if (id) {
        if (confirm(" do you want delete!") === true) {
          const { data } = await axios.delete(`/api/category/delete/${id}`);

          if (data) {
            toast.success(data);
            fetchData();
          }
        }
      }
    } catch (error) {
      console.log("deleteCat", error);
      toast.error(error);
    }
  };

  const updateCat = async (id) => {
    if (id) {
      setUpdateId(id);
      setOpenUpdateModal(true);
    }
  };

  return (
    <div>
      <div className="">
        <div className=" flex items-center justify-between ">
          <h3 className=" text-4xl font-semibold p-3">Catagory List</h3>
          <div
            onClick={() => setOpenModal(!openModal)}
            className=" flex items-center gap-1 mr-10 cursor-pointer hover:opacity-25 transition-all duration-300">
            <CiCirclePlus size={40} />
            <p className=" text-lg font-semibold">New</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Main Catagory Name</Table.HeadCell>
              <Table.HeadCell>Sub Catagory Name</Table.HeadCell>
              <Table.HeadCell>Packages</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {category?.map((cat, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{cat?._id}</Table.Cell>
                  <Table.Cell>{cat?.main}</Table.Cell>
                  <Table.Cell>
                    <Select>
                      {cat?.sub.map((c, i) => (
                        <option key={i}>{c}</option>
                      ))}
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    <Select>
                      <option>Show</option>
                      {cat?.packages.map((p, i) => (
                        <option key={i}>{p?.pack}</option>
                      ))}
                    </Select>
                  </Table.Cell>
                  <Table.Cell className=" flex items-center gap-2">
                    <button className=" bg-blue-500 text-white rounded p-1">
                      <MdModeEdit
                        onClick={() => updateCat(cat?._id)}
                        size={30}
                      />
                    </button>
                    <button className=" bg-red-500 text-white rounded p-1">
                      <MdDelete onClick={() => deleteCat(cat?._id)} size={30} />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="">
        <CreateCatModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          setCatData={setCatData}
        />
      </div>

      <div className="">
        <UpdateCat
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          setCatData={setCatData}
          updateId={updateId}
        />
      </div>
    </div>
  );
}

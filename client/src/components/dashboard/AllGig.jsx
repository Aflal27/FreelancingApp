import { Dropdown, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UpdateGig from "../dashboard/gig/updateGig/UpdateGig.jsx";
import toast from "react-hot-toast";

export default function AllGig() {
  const [allGig, setAllGig] = useState([]);
  const [updateGigModal, setUpdateGigModal] = useState(false);
  const [singleGigdata, setSingleGigdata] = useState({});
  const [updateGigId, setUpdateGigId] = useState("");

  const location = useLocation();

  const { success } = location.state || {};

  useEffect(() => {
    fetchData();
  }, [success, updateGigModal]);

  const fetchData = async () => {
    const { data } = await axios.get("/api/gig/get-all");
    setAllGig(data);
  };

  const handleSingleGig = async (id) => {
    try {
      if (id) {
        setUpdateGigId(id);
        setUpdateGigModal(true);
        const { data } = await axios.get(`/api/gig/get-single/${id}`);
        setSingleGigdata(data);
      }
    } catch (error) {
      console.log("getSingleGigError", error);
    }
  };

  const handleSingleGigDelete = async (id) => {
    try {
      if (confirm("do you want deleted!") === true) {
        const { data } = await axios.delete(`/api/gig/delete/${id}`);
        toast.success(data);
        fetchData();
      }
    } catch (error) {
      console.log("deleteError", error);
    }
  };

  return (
    <div>
      <div className="">
        <h3 className=" text-4xl font-semibold p-3">Gigs List</h3>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Gig name</Table.HeadCell>
              <Table.HeadCell>Main Catagory</Table.HeadCell>
              <Table.HeadCell>Sub Catagory</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {allGig &&
                allGig?.map((gig, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{gig?._id}</Table.Cell>
                    <Table.Cell>{gig?.title}</Table.Cell>
                    <Table.Cell>{gig?.mainCat}</Table.Cell>
                    <Table.Cell>{gig?.subCat} </Table.Cell>
                    <Table.Cell>
                      <div className=" flex items-center">
                        <p>${gig?.base?.price}</p>
                        <Dropdown inline placement="right">
                          <Dropdown.Item className=" flex items-center gap-1">
                            <p>base</p>
                            <p>${gig?.base?.price}</p>
                          </Dropdown.Item>
                          <Dropdown.Item className=" flex items-center gap-1">
                            <p>silver</p>
                            <p>${gig?.silver?.price}</p>
                          </Dropdown.Item>
                          <Dropdown.Item className=" flex items-center gap-1">
                            <p>platinum</p>
                            <p>${gig?.platinum?.price}</p>
                          </Dropdown.Item>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {gig?.status === "active" ? (
                        <p className=" text-green-600">Active</p>
                      ) : (
                        <p className=" text-red-600">Pauses</p>
                      )}
                    </Table.Cell>
                    <Table.Cell className=" flex items-center gap-2">
                      <button className=" bg-blue-500 text-white rounded p-1">
                        <MdModeEdit
                          onClick={() => handleSingleGig(gig?._id)}
                          size={30}
                        />
                      </button>
                      <button className=" bg-red-500 text-white rounded p-1">
                        <MdDelete
                          onClick={() => handleSingleGigDelete(gig?._id)}
                          size={30}
                        />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="">
        <Modal
          show={updateGigModal}
          onClose={() => setUpdateGigModal(!updateGigModal)}>
          <Modal.Header>UpdateGig</Modal.Header>
          <Modal.Body>
            <UpdateGig
              singleGigdata={singleGigdata}
              updateGigId={updateGigId}
              setUpdateGigModal={setUpdateGigModal}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

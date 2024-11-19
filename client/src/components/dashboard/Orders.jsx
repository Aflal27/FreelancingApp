import { Button, Card, Modal, Select, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import MainChat from "../chat/MainChat";
import { FaCircleArrowLeft } from "react-icons/fa6";
import OrderChat from "../chat/OrderChat";

export default function Orders() {
  const [orderCount, setOrderCount] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModelHandle, setStatusModelHandle] = useState(false);
  const [statusModelData, setStatusModelData] = useState(null);
  const [statusUpdateData, setStatusUpdateData] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/order/count");
      setOrderCount(data);
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  };

  const handleGetOrder = async (status) => {
    // setOrderDataLoading(true);
    try {
      const { data } = await axios.get(
        `/api/order/get-order-by-status/${status}`
      );
      setOrderData(data);
      // setOrderDataLoading(false);
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      // setOrderDataLoading(false);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const handelStatus = (order) => {
    setStatusModelHandle(true);
    setStatusModelData(order);
  };

  const handleStatusUpdate = async (orderId) => {
    setLoading(true);
    try {
      if (statusUpdateData) {
        const { data } = await axios.put(
          `/api/order/update-status/${orderId}`,
          { statusUpdateData }
        );
        if (data) {
          toast.success("update status successfully!");
          fetchData();
          setLoading(false);
          setStatusModelHandle(false);
          setOrderData([]);
        }
      }
    } catch (error) {
      console.log("updateOrderStatusError", error);
      setLoading(false);
    }
  };

  const handleChat = (order) => {
    if (order) {
      setChat(true);
      setSelectedOrder(order);
    }
  };

  return (
    <div className="">
      {chat ? (
        <div className="">
          <FaCircleArrowLeft
            onClick={() => setChat(false)}
            size={32}
            className=" m-5 cursor-pointer"
          />
          <div className=" flex ">
            <div className=" flex-1 mx-5">
              <OrderChat
                selectedOrder={selectedOrder}
                userID={selectedOrder?.user?._id}
              />
            </div>

            <div className="">
              <OrderDetails selectedOrder={selectedOrder} />
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="p-6 max-w-5xl mx-auto">
            <Card>
              <h3 className="text-lg font-semibold mb-6 text-center">
                Orders Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Order Status Cards */}
                {Object.entries(orderCount).map(([status, count], index) => (
                  <div
                    key={index}
                    className={`h-40 ${
                      status === "completed"
                        ? "bg-green-400"
                        : status === "processing"
                        ? "bg-red-400"
                        : "bg-sky-400"
                    } shadow-lg rounded-lg flex flex-col justify-between`}>
                    <div className="flex flex-col items-center mt-4">
                      <p className="text-xl font-bold text-white">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                      <p className="text-3xl font-semibold text-white">
                        {count ?? 0}
                      </p>
                    </div>
                    <button
                      onClick={() => handleGetOrder(status)}
                      className="text-white flex items-center justify-between px-4 py-2 font-semibold bg-opacity-75 hover:bg-opacity-100 transition-all duration-200 border-t border-opacity-30">
                      <span>View Details</span>
                      <MdOutlineKeyboardArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Table */}
            <Card className="my-6">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Order ID</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Created At</Table.HeadCell>
                  <Table.HeadCell>Amount</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {orderData.map((order) => (
                    <Table.Row key={order._id} className="cursor-pointer">
                      <Table.Cell>{order.order_id}</Table.Cell>
                      <Table.Cell>{order.status}</Table.Cell>
                      <Table.Cell>
                        {new Date(order.createdAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>${order.amount}</Table.Cell>
                      <Table.Cell className=" flex items-center gap-3">
                        <button
                          onClick={() => handleRowClick(order)}
                          className="text-blue-500">
                          View
                        </button>
                        <button
                          onClick={() => handelStatus(order)}
                          className="text-green-500">
                          Update Status
                        </button>
                        <button
                          onClick={() => handleChat(order)}
                          className="text-red-500">
                          Chat
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card>
          </div>

          {/* order details */}
          {selectedOrder && <OrderDetails selectedOrder={selectedOrder} />}

          {/* status model */}
          <div className="">
            <Modal
              show={statusModelHandle}
              onClose={() => setStatusModelHandle(false)}>
              <Modal.Header></Modal.Header>
              <Modal.Body>
                <div className=" flex items-center justify-around">
                  <div className="">
                    <strong>Order_ID</strong>
                    <p>{statusModelData?.order_id}</p>
                  </div>
                  <div className="">
                    <strong>Status</strong>
                    <Select
                      onChange={(e) => setStatusUpdateData(e.target.value)}>
                      <option value="">Select</option>
                      <option value="processing">processing</option>
                      <option value="ongoing">ongoing</option>
                      <option value="completed">completed</option>
                    </Select>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  disabled={loading}
                  onClick={() => handleStatusUpdate(statusModelData?._id)}
                  color="success"
                  className=" w-full">
                  Update Status
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

const OrderDetails = ({ selectedOrder }) => (
  <div className=" mx-[65px]">
    {/* Detailed Order View */}

    <div className="my-6">
      <Card>
        <h3 className="text-lg font-semibold text-center mb-6">
          Order Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          {/* Order Details */}
          <div>
            <strong>Order ID:</strong> {selectedOrder.order_id}
          </div>
          <div>
            <strong>Status:</strong> {selectedOrder.status}
          </div>
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(selectedOrder.updatedAt).toLocaleString()}
          </div>
          <div>
            <strong>Phone:</strong> {selectedOrder.phone}
          </div>
          <div>
            <strong>Amount:</strong> ${selectedOrder.amount}
          </div>
          <div>
            <strong>Address:</strong> {selectedOrder.address}
          </div>
          <div>
            <strong>City:</strong> {selectedOrder.city}
          </div>
          <div>
            <strong>Country:</strong> {selectedOrder.country}
          </div>

          {/* User Details */}
          <h4 className="col-span-2 text-lg font-semibold mt-4">
            User Details
          </h4>
          <div>
            <strong>Username:</strong> {selectedOrder.user?.username}
          </div>
          <div>
            <strong>Email:</strong> {selectedOrder.user?.email}
          </div>
          <div className="col-span-2">
            <img
              src={selectedOrder.user?.profile_pic}
              alt="User Profile"
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>

          {/* Gig Details */}
          <h4 className="col-span-2 text-lg font-semibold mt-4">Gig Details</h4>
          <img
            src={selectedOrder.gig.image}
            alt="Gig"
            className="col-span-2 w-full h-48 object-cover rounded-lg mb-2"
          />
          <div className="col-span-2">
            <strong>Title:</strong> {selectedOrder.gig.title}
          </div>
          <div>
            <strong>Description:</strong> ${selectedOrder.gig.description}
          </div>
          <div>
            <strong>Price:</strong> ${selectedOrder.gig.price}
          </div>
          <div>
            <strong>Delivery in:</strong> {selectedOrder.gig.day} days
          </div>

          <div className="col-span-2">
            <strong>Packages:</strong>
            <div className=" flex flex-col gap-3 mt-2">
              {selectedOrder?.gig?.packages?.map((sub, index) => (
                <div className=" flex items-center  gap-4">
                  <p className=" text-xs ">{sub?.name}</p>
                  <p className=" text-xs text-gray-400">
                    {(sub?.check && <FaCheck />) ||
                      (sub?.number && sub?.number) ||
                      (sub?.option === "unlimited" && sub?.option)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

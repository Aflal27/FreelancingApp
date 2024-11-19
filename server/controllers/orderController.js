import Order from "../models/orderModel.js";

export const createOrder = async (req, res, next) => {
  try {
    await Order.create({
      ...req.body,
    });

    res.status(200).json("create order success");
  } catch (error) {
    console.error("Error creating order:", error);
    res.sendStatus(500);
  }
};

export const getOrderStatusCounts = async (req, res) => {
  try {
    // Aggregate counts based on the 'status' field
    const counts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Initialize default counts
    const statusCounts = {
      processing: 0,
      ongoing: 0,
      completed: 0,
    };

    // Populate statusCounts with actual values from the aggregation result
    counts.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.status(200).json(statusCounts);
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    res.status(500).json({ message: "Failed to retrieve order status counts" });
  }
};

// get all orders

// Controller function to get orders by status
export const getOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  // Check if the provided status is valid
  const validStatuses = ["processing", "ongoing", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    // Find orders with the specified status
    const orders = await Order.find({ status })
      .sort({ createdAt: -1 })
      .populate("user");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

// Controller to update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Order ID from the route parameter
  const { statusUpdateData } = req.body;

  try {
    // Validate that the status is allowed
    const allowedStatuses = ["processing", "ongoing", "completed"];
    if (!allowedStatuses.includes(req.body.statusUpdateData)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // Find the order by ID and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: statusUpdateData,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// getOrderByUserId
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find orders based on the user's ID
    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

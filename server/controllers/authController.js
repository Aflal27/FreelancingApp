import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, profile_pic } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      profile_pic,
    });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (err) {
    console.log("signUp error", err);
    let message = err.message;

    if (err.name === "ValidationError") {
      message = Object.values(err.errors)
        .map((value) => value.message)
        .join(", ");
      return res.status(400).json({ message });
    }

    if (err.name === "CastError") {
      message = `Resource not found: ${err.path}`;
      return res.status(400).json({ message });
    }

    if (err.code === 11000) {
      message = `Duplicate ${Object.keys(err.keyValue)} error`;
      return res.status(400).json({ message });
    }

    if (err.name === "JsonWebTokenError") {
      message = "JSON Web Token is invalid. Try again.";
      return res.status(400).json({ message });
    }

    if (err.name === "TokenExpiredError") {
      message = "JSON Web Token has expired. Try again.";
      return res.status(400).json({ message });
    }

    // Generic error handler for unexpected errors
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// sign in
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return res.status(400).json("All fields required");
    }
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json("User not found");
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(400).json("Invalid password");
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT);

    // ignore password
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    console.log("sign in error", error);
    res.status(500).json("Internal Server error");
  }
};
export const logout = async (req, res) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("access_token", "", cookieOptions).status(200).json({
      message: "session out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

// get all user
export const getAllUser = async (req, res, next) => {
  try {
    // Assuming req.user._id contains the logged-in admin's ID
    const adminId = req.params.id;

    // Query to fetch all users except the admin
    const data = await User.find({ _id: { $ne: adminId } }) // Exclude the admin
      .sort({ createdAt: -1 })
      .select("-password"); // Exclude the password field

    res.status(200).json(data);
  } catch (error) {
    console.log("getAllUserError", error);
    next(error);
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Update only the role of a user by ID
export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Ensure the new role is either "admin" or "user"
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

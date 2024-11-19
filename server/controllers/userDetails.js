import { getToken } from "../helpers/getUserDetails.js";

export const userDetails = async (req, res) => {
  try {
    const token = req.cookies.access_token || "";
    const user = await getToken(token);
    return res.status(200).json({
      message: "user details",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log("userDetailsError", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

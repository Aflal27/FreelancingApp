import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProductedRoute({ children }) {
  const { _id } = useSelector((state) => state.userState);

  if (!_id) {
    return <Navigate to={"/sign-in"} />;
  }
  return children;
}

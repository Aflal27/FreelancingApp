import React from "react";
import { Card } from "flowbite-react";
import { useSelector } from "react-redux";
import Avatar from "../components/layout/Avatar";

export default function Profile() {
  const user = useSelector((state) => state.userState);


  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-sm w-full rounded-xl shadow-md border-0 p-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar
            image={user?.profile_pic}
            name={user?.username}
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.username}
          </h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              user.role.toLowerCase() === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}>
            {user.role}
          </span>
        </div>
      </Card>
    </div>
  );
}

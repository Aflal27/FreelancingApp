import React, { useEffect, useState } from "react";
import Sildbar from "./chat/Sildbar";
import Header from "./chat/Header";
import { useSelector } from "react-redux";
import MainChat from "../chat/MainChat";

export default function Chat({ setMessage, message }) {
  const [userId, setUserId] = useState("");

  return (
    <div className=" flex">
      {/* sildbar */}
      <div className="">
        <Sildbar setUserId={setUserId} />
      </div>
      <div className=" hidden md:inline flex-1">
        {userId ? (
          <MainChat setMessage={setMessage} message={message} userID={userId} />
        ) : (
          <div className=" w-full h-full flex items-center justify-center">
            <div className=" flex flex-col items-center">
              <img
                src="./images/conver.png"
                alt="conver"
                className=" w-[300px] h-[300px]"
              />
              <p className=" text-xl font-serif font-semibold">Live Chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

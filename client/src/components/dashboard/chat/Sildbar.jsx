import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../../layout/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { Spinner } from "flowbite-react";

export default function Sildbar({ setUserId }) {
  const [allUser, setAllUser] = useState([]);
  const { socketConnection, _id, role } = useSelector(
    (state) => state.userState
  );

  useEffect(() => {
    if (role === "admin") {
      if (socketConnection && _id) {
        socketConnection.emit("sidebar", _id);
        socketConnection.on("conversation", (data) => {
          const conversationUserData = data.map((converUser, index) => {
            if (converUser?.sender?._id === converUser?.receiver?._id) {
              return {
                ...converUser,
                userDetails: converUser?.sender,
              };
            } else if (converUser?.receiver?._id !== _id) {
              return {
                ...converUser,
                userDetails: converUser?.receiver,
              };
            } else {
              return {
                ...converUser,
                userDetails: converUser?.sender,
              };
            }
          });
          setAllUser(conversationUserData);
        });
      }
    }
  }, [socketConnection, _id]);

  return (
    <div>
      <div className=" w-screen h-screen md:w-[250px] bg-slate-300 dark:bg-slate-600">
        <div className=" w-full">
          <div className=" h-16">
            <h2 className=" text-xl text-slate-800 p-4 font-bold">Message</h2>
          </div>
          <hr />
          <div className=" h-[calc(100vh-64px)]  overflow-x-hidden overflow-y-auto scrollbar">
            <div className=" flex items-center justify-center w-full">
              {allUser.length === 0 && <p>Empty users!</p>}
            </div>
            {allUser.map((conv, index) => (
              <div
                onClick={() => setUserId(conv?.userDetails?._id)}
                // onClick={() => handleId(conv?._id)}
                key={conv?._id}
                className=" flex items-center gap-2 py-3 px-2 border border-transparent hover:border-teal-500 cursor-pointer rounded hover:bg-slate-100">
                <div className="">
                  <Avatar
                    image={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.username}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className=" line-clamp-1 text-ellipsis text-base font-semibold">
                    {conv?.userDetails?.username}
                  </p>
                  <div className=" text-xs text-slate-500 flex items-center gap-1">
                    <div className="">
                      {conv?.lastMsg?.imageUrl && (
                        <div className=" flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <p>image</p>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className=" flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <p>video</p>}
                        </div>
                      )}
                    </div>
                    <p className=" text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unSeenMsg) && (
                  <p className=" ml-auto text-xs w-5 h-5 bg-teal-400 text-white rounded-full p-1 flex items-center justify-center">
                    {conv?.unSeenMsg}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

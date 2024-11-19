import { Button, Card, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoImage } from "react-icons/io5";
import { MdDelete, MdOndemandVideo } from "react-icons/md";
import { uploadFileCloud } from "../../../../helpers/uploadFileCloud";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Gallery({
  formData,
  setFormData,
  updateGigId,
  setUpdateGigModal,
}) {
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const navigation = useNavigate();


  const handleImage = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const upload = await uploadFileCloud(file);
    if (upload) {
      setFormData((preve) => {
        return {
          ...preve,
          images: formData.images.concat(upload?.url),
        };
      });
    }

    setImageLoading(false);
  };
  const handleVideo = async (e) => {
    setVideoLoading(true);
    const file = e.target.files[0];

    try {
      // Use axios's upload progress tracking
      const upload = await uploadFileCloud(file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total // Calculate the percentage
          );
          setUploadPercentage(percentCompleted); // Update the progress state
        },
      });

      if (upload?.url) {
        setFormData((prev) => ({
          ...prev,
          videos: prev.videos.concat(upload?.url), // Update the videos array
        }));
      }

  
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("upload error!");
      setVideoLoading(false);
    }

    setVideoLoading(false);
  };



  const handleImageDelete = (data) => {
    if (data) {
      setFormData({
        ...formData,
        images: formData?.images?.filter((d) => d !== data),
      });
    }
  };
  const handleVideoDelete = (data) => {
    if (data) {
      setFormData({
        ...formData,
        videos: formData?.videos?.filter((d) => d !== data),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.images.length > 0) {
      toast.error("upload minimum 1 image and video!");
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/gig/update/${updateGigId}`,
        formData
      );
      if (data) {
        toast.success(data);
        setUpdateGigModal(false);
      }
    } catch (error) {
      toast.error(error);
      console.log("createGigError", error);
    }
  };
  return (
    <div>
      <div className="">
        <form onSubmit={handleSubmit}>
          <Card>
            <div className=" flex flex-col gap-[100px]">
              <div className="">
                <div className=" flex items-center gap-1">
                  <h3 className=" text-lg font-semibold">Upload Images:</h3>
                  <p className=" text-sm font-semibold to-gray-500">min(4)</p>
                </div>
                {imageLoading ? (
                  <Spinner />
                ) : (
                  <div className=" flex items-center gap-5">
                    <div className=" flex items-center gap-5">
                      {formData?.images &&
                        formData?.images?.map((img, index) => (
                          <div
                            key={index}
                            className=" flex flex-col items-center">
                            <img
                              src={img}
                              className=" w-[200px] h-[200px] object-contain"
                              alt="image"
                            />
                            <button className=" bg-red-500 text-white rounded p-1">
                              <MdDelete
                                onClick={() => handleImageDelete(img)}
                                size={30}
                              />
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className=" border border-dotted border-gray-400 w-[200px] h-[150px] flex items-center justify-center mt-4 hover:opacity-50 transition-all duration-300">
                      <label htmlFor="image">
                        <div className=" flex flex-col items-center">
                          <IoImage size={80} />
                          <CiCirclePlus size={20} className="" />
                        </div>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          name=""
                          id="image"
                          disabled={imageLoading}
                          onChange={handleImage}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <div className="">
                <div className=" flex items-center gap-1">
                  <h3 className=" text-lg font-semibold">Upload Videos</h3>
                  <p className=" text-sm font-semibold to-gray-500">min(4)</p>
                </div>
                {uploadPercentage > 0 && uploadPercentage < 100 && (
                  <div className="">
                    <p>{uploadPercentage} uploading...</p>
                  </div>
                )}
                <div className=" flex items-center gap-10">
                  {formData?.videos &&
                    formData?.videos.map((video, index) => (
                      <div
                        className="flex flex-col items-center gap-3"
                        key={index}>
                        <video
                          className="w-[200px] h-[200px]"
                          src={video}
                          muted
                          controls></video>
                        <button className=" bg-red-500 text-white rounded p-1">
                          <MdDelete
                            onClick={() => handleVideoDelete(video)}
                            size={30}
                          />
                        </button>
                      </div>
                    ))}
                  <div className=" border border-dotted border-gray-400 w-[200px] h-[150px] flex items-center justify-center mt-4 hover:opacity-50 transition-all duration-300">
                    <label disabled={videoLoading} htmlFor="video">
                      <div className=" flex flex-col items-center">
                        <MdOndemandVideo size={80} />
                        <CiCirclePlus size={20} className="" />
                      </div>
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        name=""
                        id="video"
                        onChange={handleVideo}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex items-center gap-5">
              <Button
                onClick={() =>
                  setHandleTabsBtn({
                    overview: false,
                    price: false,
                    desc: true,
                    gal: false,
                  })
                }
                color="success">
                Back
              </Button>
              <Button type="submit" color="success" className=" w-28">
                Update
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

import { Button, Card } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { FcVideoFile } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { uploadFileCloud } from "../../helpers/uploadFileCloud";
import toast from "react-hot-toast";

export default function Thumbnail() {
  const [videoLoading, setVideoLoading] = useState(false);
  const [Msg, setMsg] = useState({
    create: "",
    delete: "",
    update: "",
  });
  const [uploadPercentage, setUploadPercentage] = useState({
    thumbnail01: 0,
    thumbnail02: 0,
    thumbnail03: 0,
  });
  const [formData, setFormData] = useState({
    thumbnail01: "",
    thumbnail02: "",
    thumbnail03: "",
  });
  const [existingData, setExistingData] = useState(null);

  // Load existing thumbnail data on component mount
  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const { data } = await axios.get("/api/thumb/get");
        if (data) {
          setFormData({
            thumbnail01: data.thumbnail01 || "",
            thumbnail02: data.thumbnail02 || "",
            thumbnail03: data.thumbnail03 || "",
          });
          setExistingData(data); // Store the fetched data
        }
      } catch (error) {
        console.error("Failed to load thumbnails", error);
      }
    };
    fetchThumbnails();
  }, [Msg?.create, Msg?.delete, Msg?.update]);

  // Handle Create/Update request
  const handleSubmit = async () => {
    setVideoLoading(true);
    try {
      if (existingData) {
        // If data exists, update the existing thumbnails
        await axios.put(`/api/thumb/thumbnails/${existingData._id}`, formData);
        toast.success("Thumbnails updated successfully!");
        setMsg({
          update: "Thumbnails updated successfully!",
        });
      } else {
        // If no data exists, create new thumbnails
        if (
          !formData?.thumbnail01 &&
          !formData?.thumbnail02 &&
          !formData?.thumbnail03
        ) {
          toast.error("upload all feilds!");
          return;
        }
        await axios.post("/api/thumb/thumbnails", formData);
        toast.success("Thumbnails created successfully!");
        setMsg({
          create: "Thumbnails created successfully!",
        });
      }
    } catch (error) {
      console.error("Failed to submit thumbnails", error);
      toast.error("Failed to submit thumbnails");
    }
    setVideoLoading(false);
  };

  // Handle Delete request
  const handleDelete = async (thumbnailField) => {
    setFormData({ ...formData, [thumbnailField]: "" });
    setUploadPercentage({ ...uploadPercentage, [thumbnailField]: 0 });

    try {
      if (existingData) {
        await axios.put(`/api/thumb/thumbnails/${existingData._id}`, {
          ...formData,
          [thumbnailField]: "",
        });
        toast.success(`${thumbnailField} deleted successfully!`);
        setMsg({
          delete: "deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Failed to delete thumbnail", error);
      toast.error("Failed to delete thumbnail");
    }
  };

  // Handle file upload logic
  const handleVideoUpload = async (e, fieldName) => {
    setVideoLoading(true);
    const file = e.target.files[0];

    try {
      const upload = await uploadFileCloud(file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage({
            ...uploadPercentage,
            [fieldName]: percentCompleted,
          });
        },
      });

      if (upload?.url) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: upload?.url,
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload error!");
    }

    setVideoLoading(false);
  };

  return (
    <div>
      <div className="m-5">
        <h3 className="text-xl font-semibold mb-3">Upload your thumbnail</h3>

        <div>
          <Card>
            <div className="flex items-center justify-around">
              {/* Thumbnail 01 */}
              {uploadPercentage?.thumbnail01 > 0 &&
              uploadPercentage?.thumbnail01 < 100 ? (
                <p>{uploadPercentage?.thumbnail01} Uploading...</p>
              ) : (
                <div>
                  {formData?.thumbnail01 ? (
                    <div className="flex flex-col items-center gap-2">
                      <video
                        className="w-[200px] h-[200px]"
                        src={formData?.thumbnail01}
                        muted
                        controls
                      />
                      <MdDelete
                        className="text-red-500 hover:opacity-75 transition-all duration-300"
                        onClick={() => handleDelete("thumbnail01")}
                        size={22}
                      />
                    </div>
                  ) : (
                    <label htmlFor="thumbnail-1">
                      <div className="border border-dotted border-slate-300 max-w-[175px] flex flex-col items-center justify-center hover:opacity-75 transition-all duration-300 p-3">
                        <FcVideoFile size={150} />
                        <p className="text-blue-400 text-xs">Browse</p>
                        <input
                          onChange={(e) => handleVideoUpload(e, "thumbnail01")}
                          accept="video/*"
                          hidden
                          type="file"
                          id="thumbnail-1"
                        />
                      </div>
                    </label>
                  )}
                </div>
              )}

              {/* Repeat for Thumbnail 02 and Thumbnail 03 */}
              {/* Thumbnail 02 */}
              {uploadPercentage?.thumbnail02 > 0 &&
              uploadPercentage?.thumbnail02 < 100 ? (
                <p>{uploadPercentage?.thumbnail02} Uploading...</p>
              ) : (
                <div>
                  {formData?.thumbnail02 ? (
                    <div className="flex flex-col items-center gap-2">
                      <video
                        className="w-[200px] h-[200px]"
                        src={formData?.thumbnail02}
                        muted
                        controls
                      />
                      <MdDelete
                        className="text-red-500 hover:opacity-75 transition-all duration-300"
                        onClick={() => handleDelete("thumbnail02")}
                        size={22}
                      />
                    </div>
                  ) : (
                    <label htmlFor="thumbnail-2">
                      <div className="border border-dotted border-slate-300 max-w-[175px] flex flex-col items-center justify-center hover:opacity-75 transition-all duration-300 p-3">
                        <FcVideoFile size={150} />
                        <p className="text-blue-400 text-xs">Browse</p>
                        <input
                          onChange={(e) => handleVideoUpload(e, "thumbnail02")}
                          accept="video/*"
                          hidden
                          type="file"
                          id="thumbnail-2"
                        />
                      </div>
                    </label>
                  )}
                </div>
              )}

              {/* Thumbnail 03 */}
              {uploadPercentage?.thumbnail03 > 0 &&
              uploadPercentage?.thumbnail03 < 100 ? (
                <p>{uploadPercentage?.thumbnail03} Uploading...</p>
              ) : (
                <div>
                  {formData?.thumbnail03 ? (
                    <div className="flex flex-col items-center gap-2">
                      <video
                        className="w-[200px] h-[200px]"
                        src={formData?.thumbnail03}
                        muted
                        controls
                      />
                      <MdDelete
                        className="text-red-500 hover:opacity-75 transition-all duration-300"
                        onClick={() => handleDelete("thumbnail03")}
                        size={22}
                      />
                    </div>
                  ) : (
                    <label htmlFor="thumbnail-3">
                      <div className="border border-dotted border-slate-300 max-w-[175px] flex flex-col items-center justify-center hover:opacity-75 transition-all duration-300 p-3">
                        <FcVideoFile size={150} />
                        <p className="text-blue-400 text-xs">Browse</p>
                        <input
                          onChange={(e) => handleVideoUpload(e, "thumbnail03")}
                          accept="video/*"
                          hidden
                          type="file"
                          id="thumbnail-3"
                        />
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
            <div>
              <Button
                className="w-full mt-3"
                color="success"
                onClick={handleSubmit}
                disabled={videoLoading}>
                {existingData?.thumbnail01
                  ? "Update Thumbnails"
                  : "Create Thumbnails"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

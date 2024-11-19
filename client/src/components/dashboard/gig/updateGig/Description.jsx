import { Button, Card } from "flowbite-react";
import React from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Description({
  formData,
  setFormData,
  setHandleTabsBtn,
  handleTabsBtn,
}) {
  const handleDesc = () => {
    if (!formData?.description) {
      toast.error("fill the feild!");
      return;
    }
    setHandleTabsBtn({
      overview: false,
      price: false,
      desc: false,
      req: false,
      gal: true,
    });
  };
  return (
    <div>
      <Card className=" mx-5">
        <ReactQuill
          value={formData?.description}
          theme="snow"
          onChange={(value) =>
            setFormData({
              ...formData,
              description: value,
            })
          }
        />
        <div className=" flex items-center gap-5">
          <Button
            onClick={() =>
              setHandleTabsBtn({
                overview: false,
                price: true,
                desc: false,
                req: false,
                gal: false,
              })
            }
            color="success">
            Back
          </Button>

          <Button color="success" onClick={handleDesc} className=" w-28">
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}

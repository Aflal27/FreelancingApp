import React, { useEffect, useState } from "react";
import { Button, Card, Select, Tabs, Textarea } from "flowbite-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Overview({
  category,
  setFormData,
  formData,
  setHandleTabsBtn,
  handleTabsBtn,
}) {
  const [mainCatData, setmainCatData] = useState("");
  const [subCatData, setSubCatData] = useState({});
  const [mainCatId, setMainCatId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (mainCatData) {
        setFormData({
          ...formData,
          mainCat: mainCatData,
        });
      }

      try {
        const { data } = await axios.post("/api/category/get-sub", {
          mainCatData,
        });
        setSubCatData(data);
      } catch (error) {
        console.log("getSubCatError", error);
        toast.error(error);
      }
    };
    fetchData();
  }, [mainCatData]);

  const handelOverview = () => {
    if (
      formData?.title === "" ||
      formData?.mainCat === "" ||
      formData?.subCat === "" ||
      !formData?.status
    ) {
      toast.error("fill all!");
      return;
    }
    setHandleTabsBtn({
      overview: false,
      price: true,
      desc: false,
      req: false,
      gal: false,
    });
  };

  return (
    <div>
      <div className="">
        <Card className=" mx-5">
          <form className="flex max-w-xl flex-col gap-10">
            <div className=" flex items-center gap-10">
              <p className=" text-lg font-semibold w-[100px]">Gig title</p>
              <Textarea
                value={formData?.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                required
                placeholder="enter title..."
                rows={5}
              />
            </div>
            <div className=" flex items-center gap-10">
              <p className=" text-lg font-semibold">Category</p>

              <div className=" w-[200px]">
                <Select
                  onChange={(e) => setmainCatData(e.target.value)}
                  required>
                  <option value="">select</option>
                  {category?.map((cat, index) => (
                    <option value={cat?.main} key={index}>
                      {cat?.main}
                    </option>
                  ))}
                </Select>
              </div>
              <div className=" w-[200px]">
                <Select
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCat: e.target.value,
                    })
                  }
                  required>
                  <option value="">select</option>

                  {subCatData &&
                    subCatData?.catSub?.map((sub, index) => (
                      <option value={sub} key={index}>
                        {sub}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
            <div className=" flex items-center gap-16">
              <p className=" text-lg font-semibold">Status</p>
              <Select
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                required>
                <option value="">select</option>
                <option value={"active"}>Active</option>
                <option value={"pause"}>Pause</option>
              </Select>
            </div>

            <Button onClick={handelOverview} color="success" className=" w-28">
              Next
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

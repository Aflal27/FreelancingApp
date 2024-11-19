import axios from "axios";
import {
  Button,
  Card,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoPlus } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function Pricing({
  formData,
  setFormData,
  setHandleTabsBtn,
  handleTabsBtn,
}) {
  const [pack, setPackages] = useState([]);

  const [unlimited, setUnlimited] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [extraPack, setExtraPack] = useState({
    name: "",
    description: "",
    price: 0, // Initialized as a number, not Number constructor
    time: 0, // Initialized as a number, not Number constructor
  });



  useEffect(() => {
    const fetchData = async () => {
      if (formData?.mainCat) {
        try {
          const { data } = await axios.post("/api/category/get-sub", {
            mainCatData: formData?.mainCat,
          });
          setPackages(data.catPack);
        } catch (error) {
          console.log("getSubCatError", error);
          toast.error(error);
        }
      }
    };
    fetchData();
  }, [formData.mainCat]);

  useEffect(() => {
    if (unlimited?.pack === "base") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        base: {
          ...prevFormData.base,
          packages: [
            ...prevFormData.base.packages,
            {
              name: unlimited?.name,
              option: unlimited?.option,
            },
          ],
        },
      }));
    }
    if (unlimited?.pack === "silver") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        silver: {
          ...prevFormData.silver,
          packages: [
            ...prevFormData.silver.packages,
            {
              name: unlimited?.name,
              option: unlimited?.option,
            },
          ],
        },
      }));
    }
    if (unlimited?.pack === "platinum") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        platinum: {
          ...prevFormData.platinum,
          packages: [
            ...prevFormData.platinum.packages,
            {
              name: unlimited?.name,
              option: unlimited?.option,
            },
          ],
        },
      }));
    }
  }, [unlimited]);

  const handleExtraPack = () => {
    if (extraPack?.name && extraPack?.price) {
      setFormData({
        ...formData,
        extraPackage: [
          ...formData?.extraPackage, // Corrected this line
          {
            ...extraPack,
          },
        ],
      });

      // Reset the extraPack state
      setExtraPack({
        name: "",
        description: "",
        price: 0,
        time: 0,
      });

      setOpenModal(false); // Close the modal after adding the package
    }
  };
  const deleteExtraPack = (indexToDelete) => {
    setFormData((prevFormData) => {
      const updatedExtraPackages = prevFormData.extraPackage.filter(
        (extra, index) => index !== indexToDelete
      );

      return {
        ...prevFormData,
        extraPackage: updatedExtraPackages,
      };
    });
  };

  const handlePrice = () => {
    if (
      !formData?.base?.title ||
      !formData?.base?.description ||
      !formData?.base?.price ||
      !formData?.base?.delivery ||
      !formData?.silver?.title ||
      !formData?.silver?.description ||
      !formData?.silver?.price ||
      !formData?.silver?.delivery ||
      !formData?.platinum?.title ||
      !formData?.platinum?.description ||
      !formData?.platinum?.price ||
      !formData?.platinum?.delivery
    ) {
      toast.error("fill all fields!");
      return;
    }
    setHandleTabsBtn({
      overview: false,
      price: false,
      desc: true,
      req: false,
      gal: false,
    });
  };
  return (
    <div>
      <Card className=" mx-5">
        <Table>
          <Table.Head>
            <Table.HeadCell> Packages </Table.HeadCell>
            <Table.HeadCell> Base </Table.HeadCell>
            <Table.HeadCell> Silver </Table.HeadCell>
            <Table.HeadCell> Platinum </Table.HeadCell>
          </Table.Head>
          <Table.Body className=" ">
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.base?.title}
                  className=" w-full"
                  placeholder="base title"
                  type="text"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base: {
                        ...formData?.base,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.silver?.title}
                  className=" w-full"
                  placeholder="silver title"
                  type="text"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      silver: {
                        ...formData?.silver,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.platinum?.title}
                  className=" w-full"
                  placeholder="platinum title"
                  type="text"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platinum: {
                        ...formData?.platinum,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <Textarea
                  value={formData?.base?.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base: {
                        ...formData?.base,
                        description: e.target.value,
                      },
                    })
                  }
                  required
                  placeholder="description"
                />
              </Table.Cell>
              <Table.Cell>
                <Textarea
                  value={formData?.silver?.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      silver: {
                        ...formData?.silver,
                        description: e.target.value,
                      },
                    })
                  }
                  required
                  placeholder="description"
                />
              </Table.Cell>
              <Table.Cell>
                <Textarea
                  value={formData?.platinum?.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platinum: {
                        ...formData?.platinum,
                        description: e.target.value,
                      },
                    })
                  }
                  required
                  placeholder="description"
                />
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <div className=" flex items-center gap-1">
                  <span>$</span>
                  <TextInput
                    value={formData?.base?.price}
                    className=" w-full"
                    placeholder="price"
                    type="number"
                    required
                    id="title"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base: {
                          ...formData?.base,
                          price: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className=" flex items-center gap-1">
                  <span>$</span>
                  <TextInput
                    value={formData?.silver?.price}
                    className=" w-full"
                    placeholder="price"
                    type="number"
                    required
                    id="title"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        silver: {
                          ...formData?.silver,
                          price: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className=" flex items-center gap-1">
                  <span>$</span>
                  <TextInput
                    value={formData?.platinum?.price}
                    className=" w-full"
                    placeholder="price"
                    type="number"
                    required
                    id="title"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        platinum: {
                          ...formData?.platinum,
                          price: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.base?.delivery}
                  className=" w-full"
                  placeholder="delivery"
                  type="number"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      base: {
                        ...formData?.base,
                        delivery: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.silver?.delivery}
                  className=" w-full"
                  placeholder="delivery"
                  type="number"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      silver: {
                        ...formData?.silver,
                        delivery: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextInput
                  value={formData?.platinum?.delivery}
                  className=" w-full"
                  placeholder="delivery"
                  type="number"
                  required
                  id="title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platinum: {
                        ...formData?.platinum,
                        delivery: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </Table.Cell>
            </Table.Row>
            {pack &&
              pack.map((p, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{p.pack}</Table.Cell>

                  {/* Base */}
                  <Table.Cell>
                    {p?.option === "check" && (
                      <input
                        checked={
                          !!formData?.base?.packages?.find(
                            (pkg) => pkg.name === p.pack && pkg.check
                          )
                        }
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              base: {
                                ...prevFormData.base,
                                packages: [
                                  ...prevFormData.base.packages,
                                  { name: p.pack, check: true },
                                ],
                              },
                            }));
                          } else {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              base: {
                                ...prevFormData.base,
                                packages: prevFormData.base.packages.filter(
                                  (pkg) => pkg.name !== p.pack
                                ),
                              },
                            }));
                          }
                        }}
                      />
                    )}

                    {p?.option === "number" && (
                      <input
                        type="number"
                        value={
                          formData?.base?.packages?.find(
                            (pkg) => pkg.name === p.pack
                          )?.number || ""
                        }
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setFormData((prevFormData) => {
                            const updatedPackages = [
                              ...prevFormData.base.packages,
                            ];
                            const packageIndex = updatedPackages.findIndex(
                              (pkg) => pkg.name === p.pack
                            );

                            if (packageIndex !== -1) {
                              updatedPackages[packageIndex] = {
                                ...updatedPackages[packageIndex],
                                number: value,
                              };
                            } else {
                              updatedPackages.push({
                                name: p.pack,
                                number: value,
                              });
                            }

                            return {
                              ...prevFormData,
                              base: {
                                ...prevFormData.base,
                                packages: updatedPackages,
                              },
                            };
                          });
                        }}
                      />
                    )}

                    {p?.option === "unlimited" && (
                      <Select
                        onChange={(e) => {
                          setUnlimited({
                            name: p.pack,
                            option: p.option,
                            pack: "base",
                          });
                        }}>
                        <option value="">
                          {formData?.base?.packages?.find(
                            (pak) => pak.name === p?.pack
                          )?.option || "select"}
                        </option>
                        <option value={p.pack}>{p.option}</option>
                      </Select>
                    )}
                  </Table.Cell>

                  {/* Silver */}
                  <Table.Cell>
                    {p?.option === "check" && (
                      <input
                        checked={
                          !!formData?.silver?.packages?.find(
                            (pkg) => pkg.name === p.pack && pkg.check
                          )
                        }
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              silver: {
                                ...prevFormData.silver,
                                packages: [
                                  ...prevFormData.silver.packages,
                                  { name: p.pack, check: true },
                                ],
                              },
                            }));
                          } else {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              silver: {
                                ...prevFormData.silver,
                                packages: prevFormData.silver.packages.filter(
                                  (pkg) => pkg.name !== p.pack
                                ),
                              },
                            }));
                          }
                        }}
                      />
                    )}

                    {p?.option === "number" && (
                      <input
                        value={
                          formData?.silver?.packages?.find(
                            (pkg) => pkg.name === p.pack
                          )?.number || ""
                        }
                        type="number"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value) {
                            setFormData((prevFormData) => {
                              const updatedPackages = [
                                ...prevFormData.silver.packages,
                              ];
                              const packageIndex = updatedPackages.findIndex(
                                (pkg) => pkg.name === p.pack
                              );

                              if (packageIndex !== -1) {
                                updatedPackages[packageIndex] = {
                                  ...updatedPackages[packageIndex],
                                  number: value,
                                };
                              } else {
                                updatedPackages.push({
                                  name: p.pack,
                                  number: value,
                                });
                              }

                              return {
                                ...prevFormData,
                                silver: {
                                  ...prevFormData.silver,
                                  packages: updatedPackages,
                                },
                              };
                            });
                          }
                        }}
                      />
                    )}

                    {p?.option === "unlimited" && (
                      <Select
                        onChange={(e) => {
                          setUnlimited({
                            name: p.pack,
                            option: p.option,
                            pack: "silver",
                          });
                        }}>
                        <option>
                          {formData?.silver?.packages?.find(
                            (pak) => pak.name === p?.pack
                          )?.option || "select"}
                        </option>
                        <option value={p.pack}>{p.option}</option>
                      </Select>
                    )}
                  </Table.Cell>

                  {/* Platinum */}
                  <Table.Cell>
                    {p?.option === "check" && (
                      <input
                        checked={
                          !!formData?.platinum?.packages?.find(
                            (pkg) => pkg.name === p.pack && pkg.check
                          )
                        }
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              platinum: {
                                ...prevFormData.platinum,
                                packages: [
                                  ...prevFormData.platinum.packages,
                                  { name: p.pack, check: true },
                                ],
                              },
                            }));
                          } else {
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              platinum: {
                                ...prevFormData.platinum,
                                packages: prevFormData.platinum.packages.filter(
                                  (pkg) => pkg.name !== p.pack
                                ),
                              },
                            }));
                          }
                        }}
                      />
                    )}

                    {p?.option === "number" && (
                      <input
                        value={
                          formData?.platinum?.packages?.find(
                            (pkg) => pkg.name === p.pack
                          )?.number || ""
                        }
                        type="number"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value) {
                            setFormData((prevFormData) => {
                              const updatedPackages = [
                                ...prevFormData.platinum.packages,
                              ];
                              const packageIndex = updatedPackages.findIndex(
                                (pkg) => pkg.name === p.pack
                              );

                              if (packageIndex !== -1) {
                                updatedPackages[packageIndex] = {
                                  ...updatedPackages[packageIndex],
                                  number: value,
                                };
                              } else {
                                updatedPackages.push({
                                  name: p.pack,
                                  number: value,
                                });
                              }

                              return {
                                ...prevFormData,
                                platinum: {
                                  ...prevFormData.platinum,
                                  packages: updatedPackages,
                                },
                              };
                            });
                          }
                        }}
                      />
                    )}

                    {p?.option === "unlimited" && (
                      <Select
                        onChange={(e) => {
                          setUnlimited({
                            name: p.pack,
                            option: p.option,
                            pack: "platinum",
                          });
                        }}>
                        <option>
                          {formData?.platinum?.packages?.find(
                            (pak) => pak.name === p?.pack
                          )?.option || "select"}
                        </option>
                        <option value={p.pack}>{p.option}</option>
                      </Select>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div className="">
          <div
            onClick={() => setOpenModal(!openModal)}
            className=" text-blue-500 flex items-center gap-1 cursor-pointer hover:opacity-40">
            <GoPlus size={22} />
            <p>Add Gig Extra</p>
          </div>

          <div className="">
            <Table>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Time</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {formData?.extraPackage &&
                  formData?.extraPackage?.map((extra, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{extra?.name}</Table.Cell>
                      <Table.Cell>{extra?.description}</Table.Cell>
                      <Table.Cell>{extra?.price}</Table.Cell>
                      <Table.Cell>{extra?.time}</Table.Cell>
                      {extra?.name && (
                        <Table.Cell className=" flex items-center gap-2">
                          <button className=" bg-red-500 text-white rounded p-1">
                            <MdDelete
                              onClick={() => deleteExtraPack(index)}
                              size={30}
                            />
                          </button>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        {/* modal */}
        <Modal show={openModal} onClose={() => setOpenModal(!openModal)}>
          <Modal.Header>Create</Modal.Header>
          <Modal.Body>
            <form className=" flex flex-col gap-3">
              <label className="">
                <p className=" text-lg font-semibold mb-2">Name:</p>
                <TextInput
                  value={extraPack?.name}
                  onChange={(e) =>
                    setExtraPack({
                      ...extraPack,
                      name: e.target.value,
                    })
                  }
                  required
                  placeholder="enter packages"
                />
              </label>

              <label className="">
                <p className=" text-lg font-semibold mb-2">Description:</p>
                <div className="">
                  <Textarea
                    value={extraPack?.description}
                    onChange={(e) =>
                      setExtraPack({
                        ...extraPack,
                        description: e.target.value,
                      })
                    }
                    placeholder="desc..."
                  />
                </div>
              </label>

              <label>
                <p className=" text-lg font-semibold mb-2">Price:</p>
                <TextInput
                  value={extraPack?.price}
                  onChange={(e) =>
                    setExtraPack({
                      ...extraPack,
                      price: parseFloat(e.target.value), // Ensuring price is a number
                    })
                  }
                  required
                  type="number"
                />
              </label>

              <label>
                <p className=" text-lg font-semibold mb-2">
                  Time:{" "}
                  <span className=" text-sm text-gray-400">(optional)</span>
                </p>
                <TextInput
                  value={extraPack?.time}
                  onChange={(e) =>
                    setExtraPack({
                      ...extraPack,
                      time: parseInt(e.target.value), // Ensuring time is a number
                    })
                  }
                  type="number"
                />
              </label>
            </form>

            <Modal.Footer className="">
              <Button
                onClick={handleExtraPack}
                className="w-full"
                color="success">
                Add
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

        <div className=" flex items-center gap-4">
          <Button
            onClick={() =>
              setHandleTabsBtn({
                overview: true,
                price: false,
                desc: false,
                req: false,
                gal: false,
              })
            }
            color="success">
            Back
          </Button>
          <Button onClick={handlePrice} color="success" className=" w-28">
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}

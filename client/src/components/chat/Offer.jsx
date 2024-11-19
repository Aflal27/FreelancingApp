import axios from "axios";
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiDelete } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Offer({
  setOfferModal,
  offerModal,
  setMessage,
  message,
  userID,
}) {
  const [allGig, setAllGig] = useState([]);
  const [singleGigData, setsingleGigData] = useState({});
  const [extraPackage, setExtraPackage] = useState(""); // State for extra package
  const [handleOfferBtn, sethandleOfferBtn] = useState({
    gig: true,
    create: false,
  });
  const { socketConnection, _id } = useSelector((state) => state.userState);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/gig/get-all");
      setAllGig(data);
    };
    fetchData();
  }, []);

  const handlePackageSelection = (packName) => {
    setMessage((prevMessage) => {
      const { packages } = prevMessage?.offer;
      const isSelected = packages?.includes(packName);
      return {
        ...prevMessage,
        offer: {
          ...prevMessage?.offer,
          packages: isSelected
            ? packages?.filter((pkg) => pkg !== packName) // Remove package if unchecked
            : [...packages, packName], // Add package if checked
        },
      };
    });
  };

  const handleAddExtraPackage = () => {
    if (extraPackage) {
      setMessage((prevMessage) => ({
        ...prevMessage,
        offer: {
          ...prevMessage?.offer,
          packages: [...prevMessage?.offer?.packages, extraPackage], // Add the extra package
        },
      }));
      setExtraPackage(""); // Clear input after adding
    }
  };

  const handleCreateOffer = (e) => {
    e.preventDefault();
    if (
      message?.offer?.title &&
      message?.offer?.image &&
      message?.offer?.description &&
      message?.offer?.delivery &&
      message?.offer?.price &&
      message?.offer?.expire
    ) {
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: _id,
          receiver: userID,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          fileUrl: message.fileUrl,
          msgByUserId: _id,
          offer: message?.offer,
        });
      }
      setMessage({
        text: "",
        videoUrl: "",
        imageUrl: "",
        fileUrl: "",
        offer: {
          title: "",
          image: "",
          description: "",
          delivery: 0,
          price: 0,
          packages: [],
          expire: 0,
        },
      });
      setOfferModal(false);
    } else {
      toast.error("please check all field!");
    }
  };

  return (
    <div>
      <Modal
        className=""
        show={offerModal}
        onClose={() => setOfferModal(false)}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className=" ">
            <h3 className="text-xl font-semibold mb-3">Select a Gig</h3>
            {handleOfferBtn.gig && (
              <div>
                {allGig.map((gig) => (
                  <div
                    className="border shadow-md hover:opacity-45 hover:border-slate-500 transition duration-300 mb-5 p-3"
                    key={gig?.id} // Use gig.id if available for the key
                    onClick={() => {
                      setsingleGigData(gig);
                      sethandleOfferBtn({ gig: false, create: true });
                      setMessage({
                        ...message,
                        offer: {
                          ...message?.offer,
                          image: gig?.images[0],
                          title: gig?.title,
                          id: gig?._id,
                        },
                      });
                    }}>
                    <div className="flex items-center gap-3">
                      <img
                        className="w-16 h-16 object-contain"
                        src={gig?.images[0]}
                        alt={gig?.title}
                      />
                      <p>{gig?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {handleOfferBtn.create && (
              <div>
                <h3 className="text-xl font-semibold">Create Offer</h3>
                <p className="font-semibold">{singleGigData?.title}</p>
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      className="w-[200px] h-[200px] object-contain"
                      src={singleGigData?.images[0]}
                      alt={singleGigData?.title}
                    />
                    <Textarea
                      required
                      onChange={(e) =>
                        setMessage({
                          ...message,
                          offer: {
                            ...message.offer,
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe your offer"
                      rows={5}
                    />
                  </div>
                  <form className="flex max-w-md flex-col gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label value="Price" />
                      </div>
                      <TextInput
                        onChange={(e) =>
                          setMessage({
                            ...message,
                            offer: {
                              ...message.offer,
                              price: parseInt(e.target.value),
                            },
                          })
                        }
                        type="number"
                        placeholder="price"
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label value="Delivery" />
                      </div>
                      <TextInput
                        onChange={(e) =>
                          setMessage({
                            ...message,
                            offer: {
                              ...message.offer,
                              delivery: parseInt(e.target.value),
                            },
                          })
                        }
                        type="number"
                        placeholder="day"
                        required
                      />
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label value="Offer expires in" />
                      </div>
                      <TextInput
                        onChange={(e) =>
                          setMessage({
                            ...message,
                            offer: {
                              ...message.offer,
                              expire: parseInt(e.target.value),
                            },
                          })
                        }
                        type="number"
                        placeholder="days"
                        required
                      />
                    </div>

                    <div>
                      <p className="mb-2">Packages</p>
                      {singleGigData?.base?.packages?.map((pack) => (
                        <div className="flex items-center gap-1" key={pack?.id}>
                          <input
                            type="checkbox"
                            checked={message?.offer?.packages?.includes(
                              pack?.name
                            )}
                            onChange={() => handlePackageSelection(pack?.name)}
                          />
                          <p>{pack?.name}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="mb-2">Add Extra Package</p>
                      <div className="flex items-center gap-2">
                        <TextInput
                          type="text"
                          placeholder="Enter"
                          value={extraPackage}
                          onChange={(e) => setExtraPackage(e.target.value)}
                        />
                        <Button color="success" onClick={handleAddExtraPackage}>
                          Add
                        </Button>
                      </div>
                      <div className="">
                        {message?.offer?.packages?.map((p, index) => (
                          <div
                            key={index}
                            className=" flex items-center gap-3 mt-3">
                            <p className=" text-lg">{p}</p>
                            <FiDelete
                              className="hover:text-red-600 cursor-pointer"
                              onClick={() => {
                                // Filter out the package that needs to be deleted
                                setMessage((prevMessage) => ({
                                  ...prevMessage,
                                  offer: {
                                    ...prevMessage.offer,
                                    packages: prevMessage.offer.packages.filter(
                                      (pkg, pkgIndex) => pkgIndex !== index
                                    ),
                                  },
                                }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {handleOfferBtn.create && (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => sethandleOfferBtn({ gig: true, create: false })}>
                Back
              </Button>
              <form onClick={handleCreateOffer}>
                <Button type="submit">Create</Button>
              </form>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadFileCloud } from "../helpers/uploadFileCloud";
import { IoMdCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const [uploadFile, setUploadFile] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }

    try {
      setRegisterLoading(true);
      await axios.post("/api/auth/signup", formData);

      toast.success("Registered successfully!");
      navigation("/");
    } catch (error) {
      console.log("Signup submission error:", error);
      const errorResponse = error.response?.data?.message || "Signup failed.";
      toast.error(errorResponse);
      setErrorMessage(errorResponse);
    } finally {
      setRegisterLoading(false);
    }
  };
  const uploadFilePhoto = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const upload = await uploadFileCloud(file);
    setUploadFile(file);
    setFormData((preve) => {
      return {
        ...preve,
        profile_pic: upload?.url,
      };
    });
    setLoading(false);
  };


  const handleCloseBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadFile("");
  };
  return (
    <div className=" min-h-screen  md:flex items-center mt-[-50px] p-10 ">
      <Helmet>
        <title>Sign Up | DBAE Freelancing</title>
        <meta
          name="description"
          content="Join DBAE Freelancing to access top freelancers in Motion Graphics, Graphic Design, Video Editing, Web Development, and Digital Marketing in Sri Lanka."
        />
        <meta
          name="keywords"
          content="DBAE Freelancing sign up, register on freelancing platform, freelance services Sri Lanka, hire Sri Lankan freelancers"
        />
      </Helmet>
      {/*left  */}
      <div className="  p-3 max-w-3xl mx-auto flex-1 ">
        <div className=" flex flex-col items-center mt-[-50px]">
          <img
            src="/images/logo.png"
            alt="logo"
            className=" w-[300px] h-[300px]"
          />

          <p className=" text-sm ">
            This is a demo projects, you can sign in with your email and
            password or with Google{" "}
          </p>
        </div>
      </div>
      {/* right */}
      <div className="flex-1 p-3">
        <form onSubmit={handleSubmit}>
          <div>
            <Label value="Your username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label value="Your emaiil" />
            <TextInput
              type="email"
              placeholder="name@gmail.com"
              id="email"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label value="Your password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="">
            <label htmlFor="profile">
              <Label value="Your profile" />
              <p className=" bg-white p-4 text-center text-sm font-semibold hover:cursor-pointer flex items-center justify-center gap-3  text-ellipsis line-clamp-1 rounded-md border border-gray-300">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    {uploadFile?.name
                      ? uploadFile.name
                      : "Upload profile photo"}
                  </>
                )}
                {uploadFile?.name && (
                  <button onClick={handleCloseBtn}>
                    <IoMdCloseCircle
                      size={22}
                      className=" hover:text-red-600"
                    />
                  </button>
                )}
              </p>
              <input
                onChange={uploadFilePhoto}
                id="profile"
                hidden
                type="file"
                accept="image/*"
              />
            </label>
          </div>
          <Button
            type="submit"
            className=" mx-auto w-full mt-3"
            gradientDuoTone="purpleToPink"
            disabled={loading || registerLoading}>
            {registerLoading ? (
              <>
                <Spinner size="sm" /> <span> Loading... </span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className=" flex items-center gap-3 mt-3">
          <p>Have an account?</p>
          <Link className=" text-blue-500" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}

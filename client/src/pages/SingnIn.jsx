import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigate();
  //   const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage("please fill out all fields.");
    }

    try {
      const { data } = await axios.post("/api/auth/signin", formData);
      setLoading(true);

      if (data) {
        navigation("/");
      }
    } catch (error) {
      console.log("sign in submit error", error);

      setLoading(false);
      toast.error(error?.response?.data);
    }
  };

  return (
    <div className="min-h-screen  md:flex items-center mt-[-50px] p-10 ">
      <Helmet>
        <title>Sign In | DBAE Freelancing</title>
        <meta
          name="description"
          content="Sign in to DBAE Freelancing to access Motion Graphics, Graphic Design, Video Editing, Web Development, and Digital Marketing services."
        />
        <meta
          name="keywords"
          content="DBAE Freelancing sign in, freelancing account, login to freelancing platform, hire freelancers in Sri Lanka"
        />
      </Helmet>
      {/*left  */}
      <div className="  p-3 max-w-3xl mx-auto flex-1 ">
        <div className=" flex flex-col items-center mt-[-50px] ">
          <Link to={"/"} className="">
            <img
              src="/images/logo.png"
              alt="logo"
              className=" w-[300px] h-[300px]"
            />
          </Link>
          <p className=" text-sm">
            This is a demo projects, you can sign in with your email and
            password or with Google
          </p>
        </div>
      </div>
      {/* right */}
      <div className="flex-1 p-3">
        <form onSubmit={handleSubmit}>
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
              placeholder="********"
              id="password"
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className=" mx-auto w-full mt-3"
            gradientDuoTone="purpleToPink"
            disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> <span> Loading... </span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className=" flex items-center gap-3 mt-3">
          <p>Don't Have an account?</p>
          <Link className=" text-blue-500" to={"/sign-up"}>
            Sign Up
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

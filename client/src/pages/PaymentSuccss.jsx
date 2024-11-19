import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import { FaCheckCircle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function PaymentSuccess() {
  const [orderId, setOrderId] = useState("");
  const { state } = useLocation();


  useEffect(() => {
    if (state?.order?.orderId) {
      setOrderId(state?.order?.orderId);
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Helmet>
        <title>Secure Payment | DBAE Freelancing</title>
        <meta
          name="description"
          content="Secure payment gateway for Motion Graphics, Graphic Design, Video Editing, and more on DBAE Freelancing."
        />
        <meta
          name="keywords"
          content="DBAE Freelancing payment, secure payment gateway, freelance service payment, PayHere integration, freelancing services in Sri Lanka"
        />
      </Helmet>
      <Card className="max-w-md text-center p-6">
        <div className="flex flex-col items-center">
          <FaCheckCircle size={80} className="text-green-500 mb-4" />
          <h2 className="text-2xl font-semibold">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your payment was processed
            successfully.
          </p>
          {orderId && (
            <p className="text-gray-700 mt-4">
              <strong>Order ID:</strong> {orderId}
            </p>
          )}
          <Link to="/">
            <Button color="blue" className="mt-6">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

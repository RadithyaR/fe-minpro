import PaymentView from "@/views/payment";
import React from "react";

const Payment = ({ params }: { params: Promise<{ id: string }> }) => {
  return <PaymentView params={params} />;
};

export default Payment;

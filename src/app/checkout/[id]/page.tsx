import CheckoutView from "@/views/checkout";
import React from "react";

const Checkout = async ({ params }: { params: Promise<{ id: string }> }) => {
  return <CheckoutView params={params} />;
};

export default Checkout;

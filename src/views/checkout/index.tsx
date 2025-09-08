"use client";
import Layout from "@/components/layout";
import Link from "next/link";
import React from "react";
import CheckoutFormik from "./components/CheckoutFormik";
import CheckoutForm from "./components/CheckoutForm";

const CheckoutView = () => {
  return (
    <Layout>
      <CheckoutFormik>
        <CheckoutForm />
      </CheckoutFormik>
    </Layout>
  );
};

export default CheckoutView;

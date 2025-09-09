"use client";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { CheckoutFormikValues, Voucher } from "../type";
import { Formik, FormikHelpers } from "formik";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { EventResponse } from "@/views/create-event/type";
import checkoutFormSchema from "../schema/CheckoutFormSchema";

type CheckoutFormikProps = PropsWithChildren & {
  event: EventResponse;
};

const CheckoutFormik: FC<CheckoutFormikProps> = ({ children, event }) => {
  const { user, activeAccount } = useAuthStore();

  const onSubmit = async (
    values: CheckoutFormikValues,
    { setSubmitting, setFieldError }: FormikHelpers<CheckoutFormikValues>
  ) => {
    if (!activeAccount) {
      setFieldError("general", "User not authenticated");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        eventId: Number(event.id),
        quantity: Number(values.quantity),
        pointsToUse: Number(values.pointsToUse),
        couponNominal: Number(values.couponNominal),
        voucherId: values.voucherId ? Number(values.voucherId) : null,
      };

      console.log("Payload being sent:", payload);

      // Send transaction data to backend
      const response = await axios.post(
        "http://localhost:8000/transaction",
        payload,
        {
          headers: {
            Authorization: `Bearer ${activeAccount.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const transaction = response.data;
        // Redirect to confirmation page with transaction ID
        window.location.href = `/confirmation/${transaction.data.id}`;
      }
    } catch (error: any) {
      console.error("Transaction error:", error);
      if (error.response?.data?.error) {
        setFieldError("general", error.response.data.error);
      } else {
        setFieldError("general", "Failed to create transaction");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10">Please login to continue checkout</div>
    );
  }
  return (
    <Formik<CheckoutFormikValues>
      initialValues={{
        eventId: Number(event.id),
        quantity: 1,
        voucherId: "",
        pointsToUse: 0,
        couponNominal: 0,
      }}
      validationSchema={checkoutFormSchema}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
};

export default CheckoutFormik;

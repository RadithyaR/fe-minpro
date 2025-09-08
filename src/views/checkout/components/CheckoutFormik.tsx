"use client";
import React, { FC, PropsWithChildren } from "react";
import { CheckoutFormikValues } from "../type";
import { Formik, FormikHelpers } from "formik";

type CheckoutFormikProps = PropsWithChildren;

const CheckoutFormik: FC<CheckoutFormikProps> = ({ children }) => {
  const onSubmit = async (
    values: CheckoutFormikValues,
    { resetForm }: FormikHelpers<CheckoutFormikValues>
  ) => {
    try {
      const payload = {
        quantity: values.quantity,
        vouchers: values.vouchers,
        points: values.points,
      };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik<CheckoutFormikValues>
      initialValues={{
        quantity: 0,
        vouchers: "",
        points: 0,
      }}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
};

export default CheckoutFormik;

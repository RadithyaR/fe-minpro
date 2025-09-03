"use client";
import React, { FC, PropsWithChildren } from "react";
import { LocationFormikValues } from "./type";
import { Formik } from "formik";

type LocationFormikProps = PropsWithChildren;

const LocationFormik: FC<LocationFormikProps> = ({ children }) => {
  const onSubmit = async (values: LocationFormikValues) => {
    try {
      const payload = {
        city: values.city,
        address: values.address,
      };
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik<LocationFormikValues>
      initialValues={{
        city: "",
        address: "",
      }}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
};

export default LocationFormik;

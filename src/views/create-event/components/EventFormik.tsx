"use client";
import React, { FC, PropsWithChildren } from "react";
import { EventFormikValues } from "../type";
import { Formik, FormikHelpers } from "formik";

type EventFormikProps = PropsWithChildren;

const EventFormik: FC<EventFormikProps> = ({ children }) => {
  const onSubmit = async (
    values: EventFormikValues,
    { resetForm }: FormikHelpers<EventFormikValues>
  ) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        startDate: values.startDate,
        endDate: values.endDate,
        availableSeat: values.availableSeat,
        eventImage: values.eventImage,
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik<EventFormikValues>
      initialValues={{
        name: "",
        description: "",
        price: 0,
        startDate: "",
        endDate: "",
        availableSeat: 0,
        eventImage: "",
      }}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
};

export default EventFormik;

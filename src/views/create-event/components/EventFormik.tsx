"use client";
import React, { FC, PropsWithChildren } from "react";
import { EventFormikValues } from "../type";
import { Formik, FormikHelpers } from "formik";
import EventFormSchema from "../schema/EventFormSchema";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

type EventFormikProps = PropsWithChildren;

const EventFormik: FC<EventFormikProps> = ({ children }) => {
  const router = useRouter();
  const { user, activeAccount } = useAuthStore();

  const onSubmit = async (
    values: EventFormikValues,
    { resetForm, setSubmitting }: FormikHelpers<EventFormikValues>
  ) => {
    try {
      // Validasi role - hanya event organizer yang bisa create event
      if (activeAccount?.role !== "event_organizer") {
        alert("Only event organizers can create events");
        return;
      }

      // Validasi user ID
      if (!user?.id) {
        alert("User information not found. Please login again.");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      // Append semua field ke formData termasuk userId
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Untuk file, append sebagai file
          if (key === "eventImage" && value instanceof File) {
            formData.append(key, value);
          } else {
            // Untuk lainnya, append sebagai string
            formData.append(key, value.toString());
          }
        }
      });

      // const payload = {
      //   name: values.name,
      //   description: values.description,
      //   price: values.price,
      //   startDate: values.startDate,
      //   endDate: values.endDate,
      //   availableSeat: values.availableSeats,
      //   eventImage: values.eventImage,
      //   locationType: values.locationType,
      //   address: values.address,
      //   city: values.city,
      //   link: values.link,
      //   userId: user.id,
      // };

      // Kirim request ke backend
      const response = await axios.post(
        "http://localhost:8000/events/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${activeAccount.token}`,
          },
        }
      );
      console.log(response);

      console.log("Event created successfully:", response.data);

      resetForm();

      alert("Event created successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error creating event:", error);

      if (error.response) {
        alert(
          `Error: ${error.response.data.message || "Failed to create event"}`
        );
      } else {
        alert("Network error. Please try again.");
      }
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
        availableSeats: 1,
        eventImage: undefined,
        locationType: "",
        address: "",
        city: "",
        link: "",
        userId: user?.id ? parseInt(user.id) : 0,
      }}
      validationSchema={EventFormSchema}
      onSubmit={onSubmit}
    >
      <>{children}</>
    </Formik>
  );
};

export default EventFormik;

"use client";
import Layout from "@/components/layout";
import React from "react";
import EventForm from "./components/EventForm";
import EventFormik from "./components/EventFormik";
import LocationFormik from "./components/location-modal/LocationFormik";

const CreateEventView = () => {
  return (
    <Layout>
      <EventFormik>
        <EventForm />
      </EventFormik>
    </Layout>
  );
};

export default CreateEventView;

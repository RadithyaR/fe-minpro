import EventDetailView from "@/views/event-details";
import React, { use } from "react";

const EventDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return <EventDetailView params={params} />;
};

export default EventDetail;

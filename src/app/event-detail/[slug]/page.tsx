import EventDetailView from "@/views/event-details";
import React, { use } from "react";

const EventDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EventDetailView eventId={id} />;
};

export default EventDetail;

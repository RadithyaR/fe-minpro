"use client";
import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { EventResponse } from "../create-event/type";
import axios from "axios";

const EventDetailView = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  console.log("id: ", slug);
  const [ev, setEv] = useState<EventResponse | null>(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/event-detail/${slug}`
        );
        setEv(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, [slug]);

  if (!ev) {
    return (
      <Layout>
        <div className="flex flex-1 justify-center py-10">
          <div className="layout-content-container w-full max-w-5xl px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Event Not Found</h1>
              <p className="mt-4">
                The event you're looking for doesn't exist.
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="flex flex-1 justify-center py-10">
        <div className="layout-content-container w-full max-w-5xl px-4">
          <div className="mb-6 flex items-center gap-2 text-sm font-medium">
            <Link
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
              href="/"
            >
              Home
            </Link>
            <span className="text-[var(--text-secondary)]">/</span>

            <span className="text-[var(--text-primary)]">{ev.name}</span>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 overflow-hidden rounded-2xl shadow-lg">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    alt={ev.name}
                    src={
                      ev.eventImage
                        ? `http://localhost:8000/${ev.eventImage}`
                        : "/static/event.jpg"
                    }
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-[var(--primary-color)]">
                  Hosted by {ev.user?.fullName || "Innovate Solutions"}
                </p>
                <h2 className="text-4xl font-bold tracking-tighter text-[var(--text-primary)]">
                  {ev.name}
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-[var(--text-primary)]">
                    About this event
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                    {ev.description || "No description"}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">
                  Event Details
                </h3>
                <div className="space-y-2">
                  <div className="detail-item border-none pt-0">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">sell</span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Price</p>
                      <p className="detail-value text-lg font-semibold text-[var(--primary-color)]">
                        {ev.price}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Date</p>
                      <p className="detail-value">
                        {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Status</p>
                      <p className="detail-value">{ev.status}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <span className="material-symbols-outlined">groups</span>
                    </div>
                    <div className="detail-info">
                      <p className="detail-title">Available Seats</p>
                      <p className="detail-value">{ev.availableSeats}</p>
                    </div>
                  </div>
                </div>
                <Link href="/event-detail/checkout">
                  <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-bold btn-primary cursor-pointer bg-blue-700 hover:bg-blue-500">
                    <span className="truncate text-white">Buy Tickets</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailView;

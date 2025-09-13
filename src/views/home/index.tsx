"use client";
import Layout from "@/components/layout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { EventFormikValues, EventResponse } from "../create-event/type";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const HomeView = () => {
  const [ev, setEv] = useState<EventResponse[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "upcoming" | "past">(
    "upcoming"
  );
  const [isLoading, setIsLoading] = useState(true);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:8000/events");
        setEv(res.data);
        setFilteredEvents(filterEventsByDate(res.data, "upcoming"));
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filterEventsByDate = (
    events: EventResponse[],
    filter: "all" | "upcoming" | "past"
  ) => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return events.filter(
          (event) => event.endDate && new Date(event.endDate) >= now
        );
      case "past":
        return events.filter(
          (event) => event.endDate && new Date(event.endDate) < now
        );
      case "all":
      default:
        return events;
    }
  };

  useEffect(() => {
    let result = ev;

    result = filterEventsByDate(result, dateFilter);

    if (debouncedSearchQuery.trim()) {
      result = result.filter((event) =>
        event.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [debouncedSearchQuery, ev, dateFilter]);

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
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
              Upcoming Events
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover exciting events tailored to your interests.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              {/* Search Input - 2 kolom pada layar besar */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </div>
                  <input
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
                    placeholder="Search events by name..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="h-full flex flex-col justify-center">
                  <select
                    id="date-filter"
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
                    value={dateFilter}
                    onChange={(e) =>
                      setDateFilter(
                        e.target.value as "all" | "upcoming" | "past"
                      )
                    }
                  >
                    <option value="all">All Events</option>
                    <option value="upcoming">Upcoming Events</option>
                    <option value="past">Past Events</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <div className="h-full flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setDateFilter("upcoming");
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-300 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {(searchQuery || dateFilter !== "upcoming") && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Menampilkan {filteredEvents.length} hasil
                  {searchQuery && ` untuk "${searchQuery}"`}
                  {dateFilter === "past" && " (event yang sudah berlalu)"}
                  {dateFilter === "all" && " (semua event)"}
                </p>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <>
                  <p className="text-gray-500 text-lg">
                    No events found for "{searchQuery}".
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    View all events
                  </button>
                </>
              ) : (
                <p className="text-gray-500 text-lg">
                  No events available at the moment.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      alt={event.name || "Untitled Event"}
                      src={
                        event.eventImage
                          ? `http://localhost:8000/${event.eventImage}`
                          : "/static/event.jpg"
                      }
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {event.name || "Untitled Event"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {event.city || event.locationType} |{" "}
                      {event.startDate
                        ? formatDate(event.startDate)
                        : "Date not specified"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <button className="text-[var(--primary-500)] transition-colors hover:text-[var(--primary-600)] cursor-pointer">
                        <Link href={`/event-detail/${event.id}`}>
                          <span className="material-symbols-outlined text-blue-600">
                            details...
                          </span>
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomeView;

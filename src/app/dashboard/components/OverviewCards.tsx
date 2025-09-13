"use client";

import { useEffect, useState } from "react";
import {
  BanknotesIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

interface Overview {
  totalRevenue: number;
  totalAttends: number;
  eventsHosted: number;
  period: string;
}

const OverviewCards = () => {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"day" | "month" | "year">("month");

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

  const fetchOverview = async (period: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/overview?period=${period}&eventId=${parsed.eventId}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch overview", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(filter);
  }, [filter]);

  if (loading) return <p>Loading overview...</p>;
  if (!data) return <p>No data available</p>;

  const cards = [
    {
      label: "Total Revenue",
      value: `Rp ${data.totalRevenue.toLocaleString("id-ID")}`,
      icon: BanknotesIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Attends",
      value: data.totalAttends.toLocaleString("id-ID"),
      icon: UserGroupIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Events Hosted",
      value: data.eventsHosted.toString(),
      icon: CalendarDaysIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {["day", "month", "year"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p as "day" | "month" | "year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                filter === p
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {p === "day" ? "Day" : p === "month" ? "Month" : "Year"}
          </button>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ label, value, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div
              className={`p-3 rounded-xl flex items-center justify-center ${color}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;

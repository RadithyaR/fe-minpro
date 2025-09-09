"use client";

import { useEffect, useState } from "react";

interface Overview {
  totalRevenue: number;
  totalAttends: number;
  eventsHosted: number;
  period: string;
}

const OverviewCards = () => {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  // default: bulan ini
  const [filter, setFilter] = useState<"day" | "month" | "year">("month");

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch
  const fetchOverview = async (period: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/overview?period=${period}&eventId=${parsed.eventId}`);
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
    { label: "Total Revenue", value: `Rp.${data.totalRevenue.toLocaleString()}` },
    { label: "Total Attends", value: data.totalAttends.toLocaleString() },
    { label: "Events Hosted", value: data.eventsHosted.toString() },
  ];

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        {["day", "month", "year"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p as "day" | "month" | "year")}
            className={`px-3 py-1 rounded-lg border ${
              filter === p
                ? "bg-[#3B82F6]  text-white"
                : "bg-white text-gray-600 hover:bg-gray-300"
            }`}
          >
            {p === "day" ? "Day" : p === "month" ? "Month" : "Year"}
          </button>
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">{card.label}</p>
            <h2 className="text-2xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;

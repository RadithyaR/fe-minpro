"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopEventsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch

    fetch(`http://localhost:8000/api/topevents?eventId=${parsed.eventId}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h3 className="text-lg font-semibold mb-4">Top Events</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tickets" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

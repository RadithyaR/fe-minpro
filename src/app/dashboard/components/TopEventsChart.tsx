"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award } from "lucide-react";

// Beberapa warna brand-friendly
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function TopEventsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const parsed = JSON.parse(userData || "{}");

    fetch(`http://localhost:8000/api/topevents?eventId=${parsed.eventId}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      {/* Title dengan icon */}
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Top Events</h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            formatter={(value: number) =>
              `${value.toLocaleString("id-ID")} Tickets`
            }
          />
          <Bar dataKey="tickets" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

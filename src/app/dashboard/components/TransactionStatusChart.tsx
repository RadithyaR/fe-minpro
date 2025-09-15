"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

// 🔹 Mapping Tailwind class → pakai bg + text
const statusColors: Record<string, { bg: string; text: string; hex: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", hex: "#CA8A04" },   // text-yellow-800
  PAID: { bg: "bg-blue-100", text: "text-blue-800", hex: "#1E40AF" },         // text-blue-800
  DONE: { bg: "bg-green-100", text: "text-green-800", hex: "#166534" },       // text-green-800
  REJECTED: { bg: "bg-red-100", text: "text-red-800", hex: "#991B1B" },       // text-red-800
  CANCELLED: { bg: "bg-gray-200", text: "text-gray-800", hex: "#374151" },    // text-gray-800
  EXPIRED: { bg: "bg-orange-100", text: "text-orange-800", hex: "#9A3412" },  // text-orange-800
};

export default function TransactionStatusChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const parsed = JSON.parse(userData || "{}");

    fetch(
      `http://localhost:8000/api/transactions/status/status?eventId=${parsed.eventId}`
    )
      .then((res) => res.json())
      .then((json) => setData(json || []))
      .catch((err) => console.error("Error fetching status data", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow h-96">
      {/* 🔹 Header */}
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Transaction Status</h3>
      </div>

      {/* 🔹 Chart */}
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label={(entry: any) =>
              `${entry?.name} (${entry?.value?.toLocaleString("id-ID")})`
            }
            labelLine={false}
          >
            {data.map((entry: any, i: number) => (
              <Cell
                key={i}
                fill={statusColors[entry.name]?.hex || "#6B7280"} // pakai warna hex text
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) =>
              `${value?.toLocaleString?.("id-ID") ?? value} transaksi`
            }
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 🔹 Custom Legend pakai bg + text */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((entry, i) => {
          const colors = statusColors[entry.name] || {
            bg: "bg-gray-100",
            text: "text-gray-800",
          };
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md ${colors.bg} ${colors.text}`}
            >
              <span className="font-medium">
                {entry.name} ({entry.value?.toLocaleString("id-ID")})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

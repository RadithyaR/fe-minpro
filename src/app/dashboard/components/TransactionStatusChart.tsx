"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react"; // icon di title

const COLORS = [
  "#3B82F6", // biru
  "#10B981", // hijau
  "#F59E0B", // oranye
  "#EF4444", // merah
  "#8B5CF6", // ungu
  "#EAB308", // kuning
];

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
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Transaction Status</h3>
      </div>

      <ResponsiveContainer width="100%" height="90%">
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
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number) =>
              `${value?.toLocaleString?.("id-ID") ?? value} transaksi`
            }
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

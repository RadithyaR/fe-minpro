"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#4CAF50", // hijau
  "#FF9800", // oranye
  "#F44336", // merah
  "#9C27B0", // ungu
  "#2196F3", // biru
  "#FFC107", // kuning
];


export default function TransactionStatusChart() {
  const [data, setData] = useState<any[]>([]);

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch

  useEffect(() => {
    fetch(`http://localhost:8000/api/transactions/status/status?eventId=${parsed.eventId}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h3 className="text-lg font-semibold mb-4">Transaction Status</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

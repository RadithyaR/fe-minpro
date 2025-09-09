"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
}

const RevenueChart = () => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/revenue?eventId=${parsed.eventId}`); // BE URL
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching revenue data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-bold mb-4">Revenue Trends (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

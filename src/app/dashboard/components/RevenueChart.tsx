"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
}

const RevenueChart = () => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/revenue?eventId=${parsed.eventId}`
        );
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
      {/* Title dengan icon */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">
          Revenue Trends <span className="text-gray-500">(Last 12 Months)</span>
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            formatter={(value: number) =>
              `Rp ${value.toLocaleString("id-ID")}`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

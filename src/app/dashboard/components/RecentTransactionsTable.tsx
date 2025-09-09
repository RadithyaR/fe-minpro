"use client";

import { useEffect, useState } from "react";

// mapping status → warna (sesuai chart Transaction Status)
const statusColors: Record<string, string> = {
  CANCELLED: "bg-purple-500",
  EXPIRED: "bg-yellow-500",
  FAILED: "bg-green-500",
  PAID: "bg-orange-500",
  PENDING: "bg-red-500",
  REFUNDED: "bg-blue-500",
};


export default function RecentTransactionsTable() {
  const [data, setData] = useState<any[]>([]);

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch


  useEffect(() => {
    fetch(`http://localhost:8000/api/transactions/status/recent?eventId=${parsed.eventId}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">User</th>
            <th className="p-2">Event</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => (
            <tr key={i} className="border-b last:border-none">
              <td className="p-2">{tx.user}</td>
              <td className="p-2">{tx.event}</td>
              <td className="p-2">Rp {tx.amount.toLocaleString()}</td>
              <td className="p-2">
              <span
                className={`px-2 py-1 rounded text-white text-xs ${
                  statusColors[tx.status.toUpperCase()] || "bg-gray-400"
                }`}
              >
                {tx.status}
              </span>
            </td>
              <td className="p-2">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

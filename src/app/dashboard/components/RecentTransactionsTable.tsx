"use client";

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";

// Mapping status → warna badge
const statusColors: Record<string, string> = {
  CANCELLED: "bg-gray-400",     // abu-abu
  EXPIRED: "bg-orange-400",    // oranye
  REJECTED: "bg-red-400",       // merah
  PAID: "bg-green-400",        // hijau
  PENDING: "bg-yellow-400",    // kuning
  // REFUNDED: "bg-blue-400 ",   // biru
};


export default function RecentTransactionsTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const parsed = JSON.parse(userData || "{}");

    const fetchTx = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/transactions/status/recent?eventId=${parsed.eventId}`
        );
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch recent transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, []);

  if (loading) return <p className="text-gray-500">Loading recent transactions...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      {/* Title with icon */}
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b bg-gray-50 text-gray-600">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx, i) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-700">{tx.user}</td>
                  <td className="px-4 py-3 text-gray-700">{tx.event}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Rp {Number(tx.amount).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-white text-xs font-semibold ${
                        statusColors[tx.status?.toUpperCase()] || "bg-gray-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(tx.date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

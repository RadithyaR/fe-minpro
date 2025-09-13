"use client";

import { useEffect, useState } from "react";

interface Attendee {
  name: string;
  qty: number;
  price: string;
  event: string;
}

const AttendeeTable = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("userData");
  const parsed = JSON.parse(userData || "{}");

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/attendees?eventId=${parsed.eventId}`
        );
        const data = await res.json();
        setAttendees(data);
      } catch (err) {
        console.error("Failed to fetch attendees", err);
      } finally {
        setLoading(false);
      }
    };

    if (parsed?.eventId) {
      fetchAttendees();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">Attendee List</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4 text-gray-800">🎟️ Attendee List</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Ticket Quantity</th>
              <th className="px-4 py-3">Total Price</th>
              <th className="px-4 py-3">Event</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.qty}</td>
                  <td className="px-4 py-3 text-gray-700">
                    Rp.{" "}
                    {Number(
                      row.price.toString().replace(/[^\d]/g, "") // ambil angka saja
                    ).toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-3 text-gray-700">{row.event}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No attendees found for this event.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendeeTable;

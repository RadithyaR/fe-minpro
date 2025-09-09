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

    // if (!parsed?.eventId) return; // kalau belum ada, jangan fetch

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/attendees?eventId=${parsed.eventId}`); // backend URL
        const data = await res.json();
        setAttendees(data);
      } catch (err) {
        console.error("Failed to fetch attendees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  if (loading) return <p>Loading attendees...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-bold mb-4">Attendee List</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Ticket Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Event</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.qty}</td>
                <td className="px-4 py-2">{row.price}</td>
                <td className="px-4 py-2">{row.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendeeTable;

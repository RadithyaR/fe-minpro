"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import { Dialog } from "@/components/ui/dialog";

// 🔹 tipe data Event sesuai API
type Event = {
  id: number;
  userId: number;
  name: string;
  description: string;
  locationType: "online" | "offline";
  address: string | null;
  city: string | null;
  link: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: string;
  availableSeats: number;
  price: number;
  eventImage: string | null;
  reviews: any[];
  transactions: any[];
  user: { id: number; email: string; name?: string };
  statistics: {
    totalTransactions: number;
    completedTransactions: number;
    totalRevenue: number;
    averageRating: number;
    availableSeats: number;
  };
};

// helper format tanggal
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [viewing, setViewing] = useState<Event | null>(null);
  type EventForm = Omit<Event, "id" | "userId"> & {
    file?: File; // biar bisa simpan file upload sementara
};

const [form, setForm] = useState<Partial<EventForm>>({});
const [preview, setPreview] = useState<string | null>(null);

const userData = localStorage.getItem("userData");
const parsed = JSON.parse(userData || "{}");
const token = parsed.token;
const Role = localStorage.getItem("role");
  // 🔹 Fetch events milik organizer
  useEffect(() => {
    
    if (!token) return;

    fetch("http://localhost:8000/api/event/getEventsByOrganizer", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Role: Role || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          console.error("Unexpected API response:", data);
          setEvents([]);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // 🔹 Delete event
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/event/deleteEvent/${id}`, {
      method: "DELETE",
     headers: {
        Authorization: `Bearer ${token}`,
        Role: Role || "",
      },
    });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // 🔹 Start edit mode
  const handleEdit = (event: Event) => {
    setEditing(event);
    setForm({
      ...event,
      startDate: event.startDate?.slice(0, 10),
      endDate: event.endDate?.slice(0, 10),
    });
  };

  // 🔹 Save edited event
const handleSave = async () => {
  if (!editing) return;
  if (!token) return;
  const formData = new FormData();
  formData.append("name", form.name || "");
  formData.append("description", form.description || "");
  formData.append("locationType", form.locationType || "offline");
  formData.append("address", form.address || "");
  formData.append("city", form.city || "");
  formData.append("link", form.link || "");
  formData.append("startDate", form.startDate || "");
  formData.append("endDate", form.endDate || "");
  formData.append("price", String(form.price ?? 0));
  formData.append("availableSeats", String(form.availableSeats ?? 0));

  // kalau ada file baru
  if ((form as any).file) {
    formData.append("eventImage", (form as any).file);
  } else {
    if (form.file) {
        formData.append("eventImage", form.file);
    }
  }

  const res = await fetch(`http://localhost:8000/api/event/updateEvent/${editing.id}`, {
    method: "PUT",
    headers: {
        Authorization: `Bearer ${token}`,
        Role: Role || "",
      },
    body: formData,
  });

  if (res.ok) {
    const data = await res.json();
    setEvents((prev) =>
      prev.map((e) => (e.id === data.event.id ? data.event : e))
    );
    setEditing(null);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="p-12 bg-white rounded-xl shadow flex-1 overflow-auto space-y-6">
        <h2 className="text-xl font-bold mb-4">My Events</h2>

        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Status</th>
                <th className="p-2">Price</th>
                <th className="p-2">Seats</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b">
                  <td className="p-2">{ev.id}</td>
                  <td className="p-2">{ev.name}</td>
                  <td className="p-2">{formatDate(ev.startDate)}</td>
                  <td className="p-2">{formatDate(ev.endDate)}</td>
                  <td className="p-2">{ev.status}</td>
                  <td className="p-2">{ev.price.toLocaleString()}</td>
                  <td className="p-2">{ev.availableSeats}</td>
                  <td className="p-2 flex gap-2">
                    <Button variant="outline" onClick={() => setViewing(ev)}>
                      View
                    </Button>
                    <Button variant="outline" onClick={() => handleEdit(ev)}>
                      Edit
                    </Button>
                    <Button
                      className="bg-red-600 text-white"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔹 Edit Form */}
        {editing && (
        <div className="mt-6 p-4 border rounded bg-gray-50 space-y-3">
            <h3 className="text-lg font-semibold mb-1">Edit Event</h3>
            <p className="text-sm text-gray-600 mb-3">
            You are editing: <span className="font-medium">{editing.name}</span>
            </p>

            {/* Preview Image */}
            {preview ? (
            <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded mb-2"
            />
            ) : form.eventImage ? (
            <img
                src={`http://localhost:8000/${form.eventImage}`}
                alt="Event"
                className="w-full h-48 object-cover rounded mb-2"
            />
            ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2">
                <span className="text-gray-500">No Image</span>
            </div>
            )}

            {/* Upload Image */}
            <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    setForm({ ...form, file });
                    setPreview(URL.createObjectURL(file));
                }
                }}
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Event Name */}
            <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Event name"
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Description */}
            <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Location Type */}
            <div>
            <label className="block text-sm font-medium mb-1">Location Type</label>
            <select
                value={form.locationType || "offline"}
                onChange={(e) =>
                setForm({ ...form, locationType: e.target.value as "online" | "offline" })
                }
                className="w-full border p-2 rounded"
            >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
            </select>
            </div>

            {/* Address / City or Link */}
            {form.locationType === "offline" ? (
            <>
                <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                    value={form.address || ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                />
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                    value={form.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="City"
                    className="w-full border p-2 rounded"
                />
                </div>
            </>
            ) : (
            <div>
                <label className="block text-sm font-medium mb-1">Event Link</label>
                <input
                value={form.link || ""}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="Event Link"
                className="w-full border p-2 rounded"
                />
            </div>
            )}

            {/* Dates */}
            <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
                type="date"
                value={form.startDate || ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border p-2 rounded"
            />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
                type="date"
                value={form.endDate || ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Price */}
            <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
                type="number"
                value={form.price || 0}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="Price"
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Available Seats */}
            <div>
            <label className="block text-sm font-medium mb-1">Available Seats</label>
            <input
                type="number"
                value={form.availableSeats || 0}
                onChange={(e) =>
                setForm({ ...form, availableSeats: Number(e.target.value) })
                }
                placeholder="Available Seats"
                className="w-full border p-2 rounded"
            />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
            <Button className="bg-green-600 text-white" onClick={handleSave}>
                Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
            </Button>
            </div>
        </div>
        )}



        {/* 🔹 Detail Modal */}
        {viewing && (
          <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] space-y-2">
                <h3 className="text-lg font-semibold mb-4">{viewing.name}</h3>
                <p><strong>ID:</strong> {viewing.id}</p>
                <p><strong>User ID:</strong> {viewing.userId}</p>
                <p><strong>Description:</strong> {viewing.description}</p>
                <p><strong>Status:</strong> {viewing.status}</p>
                <p><strong>Start:</strong> {formatDate(viewing.startDate)}</p>
                <p><strong>End:</strong> {formatDate(viewing.endDate)}</p>
                <p><strong>Created:</strong> {formatDate(viewing.createdAt)}</p>
                <p><strong>Location:</strong> {viewing.locationType}</p>
                <p><strong>Address:</strong> {viewing.address || "-"}</p>
                <p><strong>City:</strong> {viewing.city || "-"}</p>
                <p><strong>Link:</strong> {viewing.link || "-"}</p>
                <p><strong>Price:</strong> {viewing.price.toLocaleString()}</p>
                <p><strong>Seats:</strong> {viewing.availableSeats}</p>
                <p><strong>Image:</strong> {viewing.eventImage ? <img src={`http://localhost:8000/${viewing.eventImage}`} alt="Event" className="w-full h-40 object-cover rounded" /> : "-"}</p>
                <p><strong>User:</strong> {viewing.user?.email}</p>
                <p><strong>Statistics:</strong> {JSON.stringify(viewing.statistics)}</p>
                <p><strong>Transactions:</strong> {viewing.transactions?.length} record(s)</p>
                <p><strong>Reviews:</strong> {viewing.reviews?.length} review(s)</p>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

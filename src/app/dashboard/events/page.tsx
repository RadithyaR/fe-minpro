"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  statusEvent: string;
  user: { id: number; email: string; name?: string };
  statistics: {
    totalTransactions: number;
    completedTransactions: number;
    totalRevenue: number;
    averageRating: number;
    availableSeats: number;
  };
};

type Voucher = {
  id?: number;
  eventId: number;
  nominal: number;
  quota: number;
  code?: string;
  isUsed?: boolean;
  expiredAt?: string;
  createdAt?: string;
};

type EventForm = Omit<Event, "id" | "userId"> & { file?: File };

// helper format tanggal
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [viewing, setViewing] = useState<Event | null>(null);
  const [voucherDialog, setVoucherDialog] = useState<Event | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherForm, setVoucherForm] = useState<Partial<Voucher>>({
    nominal: 0,
    quota: 1,
  });
  const [isCreatingVoucher, setIsCreatingVoucher] = useState(false);
  const [form, setForm] = useState<Partial<EventForm>>({});
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 auth state
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // 🔹 ambil data user dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("activeAccount");
    const parsed = JSON.parse(userData || "{}");
    setToken(parsed.token || null);
    setRole(localStorage.getItem("role"));
  }, []);

  // 🔹 Fetch events milik organizer
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/api/event/getEventsByOrganizer", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Role: role || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [token, role]);

  // 🔹 Fetch vouchers untuk event tertentu
  const fetchVouchers = async (eventId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/voucher/event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVouchers(data.data || data.vouchers || data);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  // 🔹 Create voucher
  const createVoucher = async (eventId: number) => {
    if (!token || !voucherForm.nominal || !voucherForm.quota) return;

    setIsCreatingVoucher(true);

    try {
      const response = await fetch("http://localhost:8000/voucher/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          nominal: voucherForm.nominal,
          quota: voucherForm.quota,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setVouchers((prev) => [...prev, result.data || result]);
        setVoucherForm({ nominal: 0, quota: 1 });
        alert("Voucher created successfully!");
      } else {
        alert("Failed to create voucher");
      }
    } catch (error) {
      console.error("Error creating voucher:", error);
      alert("Error creating voucher");
    }
  };

  // 🔹 Delete voucher
  const deleteVoucher = async (voucherId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/voucher/${voucherId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setVouchers((prev) => prev.filter((v) => v.id !== voucherId));
        alert("Voucher deleted successfully!");
      } else {
        alert("Failed to delete voucher");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Error deleting voucher");
    }
  };

  // 🔹 Delete event
  const handleDelete = async (id: number) => {
    if (!token) return;
    await fetch(`http://localhost:8000/api/event/deleteEvent/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Role: role || "",
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
    if (!editing || !token) return;

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

    if (form.file) {
      formData.append("eventImage", form.file);
    }

    const res = await fetch(`http://localhost:8000/updateEvent/${editing.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Role: role || "",
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e.id === data.event.id ? data.event : e))
      );
      setEditing(null);
    } else {
      console.error("Update failed", await res.text());
    }
  };

  // 🔹 Open voucher dialog
  const openVoucherDialog = async (event: Event) => {
    setVoucherDialog(event);
    setVouchers([]);
    await fetchVouchers(event.id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1  p-8">
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎭 My Events
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-500 italic">No events yet.</p>
          ) : (
            <table className="w-full border border-gray-200 bg-white shadow-xl rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700 uppercase text-sm">
                  <th className="p-3 border text-left">ID</th>
                  <th className="p-3 border text-left">Name</th>
                  <th className="p-3 border text-center">Start</th>
                  <th className="p-3 border text-center">End</th>
                  <th className="p-3 border text-right">Ticket Price</th>
                  <th className="p-3 border text-center">Seats</th>
                  <th className="p-3 border text-center">voucher</th>
                  <th className="p-3 border text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {events.map((ev, idx) => (
                  <tr
                    key={ev.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50/50 transition-colors"
                  >
                    <td className="p-2 border">{ev.id}</td>
                    <td className="p-2 border font-medium">{ev.name}</td>
                    <td className="p-2 border text-center">
                      {formatDate(ev.startDate)}
                    </td>
                    <td className="p-2 border text-center">
                      {formatDate(ev.endDate)}
                    </td>
                    <td className="p-2 border text-right font-semibold text-indigo-700">
                      Rp {ev.price.toLocaleString()}
                    </td>
                    <td className="p-2 border text-center">
                      {ev.availableSeats}
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                          onClick={() => openVoucherDialog(ev)}
                        >
                          Manage
                        </Button>
                      </div>
                    </td>
                    <td className="p-2 border text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                          onClick={() => setViewing(ev)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          onClick={() => handleEdit(ev)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(ev.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔹 Voucher Management Dialog */}
        {voucherDialog && (
          <Dialog
            open={!!voucherDialog}
            onOpenChange={() => setVoucherDialog(null)}
          >
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Voucher Management - {voucherDialog.name}
                </h3>

                {/* Create Voucher Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Create New Voucher</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nominal" className="mb-2">
                        Nominal (Rp)
                      </Label>
                      <Input
                        id="nominal"
                        type="number"
                        value={voucherForm.nominal}
                        onChange={(e) =>
                          setVoucherForm({
                            ...voucherForm,
                            nominal: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quota" className="mb-2">
                        Quota
                      </Label>
                      <Input
                        id="quota"
                        type="number"
                        value={voucherForm.quota}
                        onChange={(e) =>
                          setVoucherForm({
                            ...voucherForm,
                            quota: parseInt(e.target.value) || 1,
                          })
                        }
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => createVoucher(voucherDialog.id)}
                    disabled={isCreatingVoucher}
                  >
                    {isCreatingVoucher ? "Creating..." : "Create Voucher"}
                  </Button>
                </div>

                {/* Vouchers List */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Existing Vouchers: ({vouchers.length})
                  </h4>
                  {vouchers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No vouchers created yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {vouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              id: {voucher.id || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Rp {voucher.nominal.toLocaleString()} • Quota:{" "}
                              {voucher.quota}
                            </p>
                            {voucher.createdAt && (
                              <p className="text-xs text-gray-500">
                                Created: {formatDate(voucher.createdAt)}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              voucher.id && deleteVoucher(voucher.id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setVoucherDialog(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}

        {/* 🔹 Edit Form */}
        {editing && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-orange-500">✏️</span> Edit Event
            </h3>

            {/* Upload Image Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Event Image
              </label>

              <div className="flex items-center gap-4">
                {/* Preview image */}
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                ) : form.eventImage ? (
                  <img
                    src={`http://localhost:8000/${form.eventImage}`}
                    alt="Event"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg border text-gray-500">
                    No Image
                  </div>
                )}

                {/* File Input */}
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setForm({ ...form, file });
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    📂 Choose File
                  </label>
                  {form.file && (
                    <p className="mt-2 text-sm text-gray-500">
                      {form.file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location Type
                </label>
                <select
                  value={form.locationType || "offline"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      locationType: e.target.value as "online" | "offline",
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>

              {form.locationType === "offline" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      value={form.address || ""}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      value={form.city || ""}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Event Link
                  </label>
                  <input
                    value={form.link || ""}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.endDate || ""}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={form.price || 0}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seats</label>
                <input
                  type="number"
                  value={form.availableSeats || 0}
                  onChange={(e) =>
                    setForm({ ...form, availableSeats: Number(e.target.value) })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <Button
                className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* 🔹 Detail Modal */}
        {viewing && (
          <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  {viewing.name}
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                  <p>
                    <b>ID Event:</b> {viewing.id}
                  </p>
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      className={`ml-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                        viewing.statusEvent === "active"
                          ? "bg-green-100 text-green-700"
                          : viewing.statusEvent === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {viewing.statusEvent}
                    </span>
                  </p>
                  <p>
                    <b>Start:</b> {formatDate(viewing.startDate)}
                  </p>
                  <p>
                    <b>End:</b> {formatDate(viewing.endDate)}
                  </p>
                  <p>
                    <b>Created:</b> {formatDate(viewing.createdAt)}
                  </p>
                  <p>
                    <b>Location:</b> {viewing.locationType}
                  </p>
                  <p>
                    <b>Address:</b> {viewing.address || "-"}
                  </p>
                  <p>
                    <b>City:</b> {viewing.city || "-"}
                  </p>
                  <p>
                    <b>Link:</b>{" "}
                    {viewing.link ? (
                      <a
                        href={viewing.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open
                      </a>
                    ) : (
                      "-"
                    )}
                  </p>
                  <p>
                    <b>Price:</b> Rp {viewing.price.toLocaleString()}
                  </p>
                  <p>
                    <b>Seats:</b> {viewing.availableSeats}
                  </p>
                  <p>
                    <b>User:</b> {viewing.user?.email}
                  </p>
                  <p>
                    <b>Transactions:</b> {viewing.transactions?.length}{" "}
                    record(s)
                  </p>
                  <p>
                    <b>Reviews:</b> {viewing.reviews?.length} review(s)
                  </p>
                </div>

                <div className="mt-6 border-t pt-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    Description
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {viewing.description}
                  </p>
                </div>

                {viewing.eventImage && (
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold text-gray-900 mb-2">Image</p>
                    <img
                      src={`http://localhost:8000/${viewing.eventImage}`}
                      alt="Event"
                      className="w-full h-64 object-cover rounded-lg shadow"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setViewing(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
}

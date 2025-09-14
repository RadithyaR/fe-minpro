"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  role: string;
  createdAt: string;
};

type Tx = {
  id: number;
  eventName: string;
  amount: number;
  status: string;
  createdAt: string;
};

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "/default-avatar.png";
  return avatar.startsWith("http")
    ? avatar
    : `${process.env.NEXT_PUBLIC_API_URL}/${avatar}`;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [stats, setStats] = useState({
    totalTx: 0,
    totalEvents: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const acc = localStorage.getItem("activeAccount");
    if (!acc) {
      router.push("/sign-in");
      return;
    }

    try {
      const parsed = JSON.parse(acc);

      if (!parsed.token) {
        router.push("/sign-in");
        return;
      }

      const fetchData = async () => {
        try {
          // 🔹 Fetch profile
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
            { headers: { Authorization: `Bearer ${parsed.token}` } }
          );
          if (!res.ok) throw new Error("Unauthorized");
          const data = await res.json();
          const user = data.user;
          setProfile({
            name: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            bio: user.bio || "",
            avatar: user.profilePicture || "",
            role: user.role?.name || "User",
            createdAt: user.createdAt || "",
          });

          // 🔹 Fetch statistik
          const statsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile/stats`,
            { headers: { Authorization: `Bearer ${parsed.token}` } }
          );
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats({
              totalTx: statsData.totalTx || 0,
              totalEvents: statsData.totalEvents || 0,
              totalSpent: statsData.totalSpent || 0,
            });
          }

          // 🔹 Fetch transaksi terbaru
          const txRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile/transactions?limit=5`,
            { headers: { Authorization: `Bearer ${parsed.token}` } }
          );
          if (txRes.ok) {
            const txData = await txRes.json();
            setTransactions(
              txData.map((tx: any) => ({
                id: tx.id,
                eventName: tx.event?.name || "Tanpa Nama",
                amount: tx.amount,
                status: tx.status?.name || "PENDING",
                createdAt: tx.createdAt,
              }))
            );
          }
        } catch (err) {
          console.error("Gagal fetch profile:", err);
          router.push("/sign-in");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } catch (e) {
      console.error("activeAccount invalid", e);
      router.push("/sign-in");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="shadow-lg rounded-2xl w-[400px]">
          <div className="bg-gradient-to-r from-[#55AFF8] to-[#3A7BD5] p-6 text-center text-white">
            <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-60" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center mt-10">Profile tidak ditemukan</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Profile Card */}
          <Card className="shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#55AFF8] to-[#3A7BD5] p-6 text-center text-white">
              <img
                src={getAvatarUrl(profile.avatar)}
                alt="Avatar"
                className="w-28 h-28 rounded-full border-4 border-white mx-auto mb-3 object-cover shadow-md"
              />
              <h2 className="text-xl font-bold">{profile.name || "Tanpa Nama"}</h2>
              <p className="text-sm opacity-80">{profile.email || "-"}</p>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Detail */}
              <div className="grid grid-cols-3 gap-y-3">
                <p className="text-sm text-gray-500">📞 No. HP</p>
                <p className="col-span-2 font-medium">{profile.phone || "-"}</p>

                <p className="text-sm text-gray-500">💬 Bio</p>
                <p className="col-span-2 font-medium">{profile.bio || "-"}</p>

                <p className="text-sm text-gray-500">🛡️ Role</p>
                <p className="col-span-2 font-medium capitalize">{profile.role}</p>

                <p className="text-sm text-gray-500">📅 Bergabung</p>
                <p className="col-span-2 font-medium">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>

              {/* Statistik ringkas */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <p className="text-lg font-bold text-blue-600">{stats.totalTx}</p>
                  <p className="text-xs text-gray-500">Transaksi</p>
                </div>
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <p className="text-lg font-bold text-green-600">{stats.totalEvents}</p>
                  <p className="text-xs text-gray-500">Event Ikut</p>
                </div>
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <p className="text-lg font-bold text-purple-600">
                    Rp {stats.totalSpent.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">Total Belanja</p>
                </div>
              </div>

              <Button asChild className="w-full mt-4 rounded-xl font-semibold">
                <a href="/settings/edit">✏️ Edit Profile</a>
              </Button>
            </CardContent>
          </Card>

          {/* Section tambahan: Transaksi terbaru */}
          <Card className="shadow-md rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">🧾 Transaksi Terbaru</h3>
              {transactions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="py-3 flex justify-between">
                      <span className="text-gray-700">{tx.eventName}</span>
                      <span
                        className={`text-sm font-medium ${
                          tx.status === "PAID" || tx.status === "DONE"
                            ? "text-green-600"
                            : tx.status === "REJECTED" || tx.status === "CANCELLED"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {tx.status === "PAID" || tx.status === "DONE"
                          ? `Rp ${tx.amount.toLocaleString("id-ID")}`
                          : tx.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada transaksi</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

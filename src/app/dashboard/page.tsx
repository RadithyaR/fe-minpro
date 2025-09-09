"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import OverviewCards from "./components/OverviewCards";
import AttendeeTable from "./components/AttendeeTable";
import RevenueChart from "./components/RevenueChart";
import TransactionStatusChart from "./components/TransactionStatusChart";
import TopEventsChart from "./components/TopEventsChart";
import RecentTransactionsTable from "./components/RecentTransactionsTable";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        router.push("/sign-in");
        return;
      }
    
      const parsed = JSON.parse(userData);

      if (!parsed?.token) {
        router.push("/sign-in");
        return;
      } setAuthenticated(true);

      // try {
      //   const res = await fetch("http://localhost:8000/api/auth/verify", {
      //     headers: { Authorization: `Bearer ${parsed.token}` },
      //   });

      //   if (!res.ok) {
      //     router.push("/sign-in");
      //     return;
      //   }

      //   setAuthenticated(true);
      // } catch (err) {
      //   console.error("Token check failed", err);
      //   router.push("/sign-in");
      // }
    };

    checkAuth().finally(() => setLoading(false));
  }, [router]);


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!authenticated) return null; // jangan render apa2 kalau belum login

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto space-y-6">
        {/* Topbar */}
        <Topbar />

        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <TransactionStatusChart />
        </div>

        {/* Top Events + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopEventsChart />
          <RecentTransactionsTable />
        </div>

        {/* Attendee List */}
        <AttendeeTable />
      </main>
    </div>
  );
}

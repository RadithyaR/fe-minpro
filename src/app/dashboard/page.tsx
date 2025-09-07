"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  HomeIcon,
  Squares2X2Icon,
  CalendarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Dummy Data
const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 2400 },
  { month: "May", revenue: 2000 },
  { month: "Jun", revenue: 2500 },
  { month: "Jul", revenue: 3000 },
  { month: "Aug", revenue: 2800 },
  { month: "Sep", revenue: 3200 },
  { month: "Oct", revenue: 4000 },
  { month: "Nov", revenue: 3600 },
  { month: "Dec", revenue: 4200 },
];

const demographicsData = [
  { name: "Male", value: 60 },
  { name: "Female", value: 40 },
];

const COLORS = ["#0088FE", "#FF8042"];

// Sidebar Component
const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
    { href: "/dashboard/transactions", label: "Transactions", icon: CurrencyDollarIcon },
    { href: "/dashboard/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <Link href="/" className="relative w-[280px] h-[280px] block">
          <Image
            src="/static/logo-blue.webp"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 p-2 rounded transition
                ${active ? "bg-blue-50 text-[#3B82F6] font-semibold" : "text-gray-700 hover:bg-blue-50"}
              `}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

// Overview Cards
const OverviewCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {[
      { label: "Total Revenue", value: "$45,600" },
      { label: "Total Attends", value: "1,230" },
      { label: "Events Hosted", value: "12" },
    ].map((card, idx) => (
      <div key={idx} className="bg-white p-4 rounded-xl shadow">
        <p className="text-gray-500">{card.label}</p>
        <h2 className="text-2xl font-bold">{card.value}</h2>
      </div>
    ))}
  </div>
);

// Attendee Table
const AttendeeTable = () => (
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
          {[
            { name: "John Doe", qty: 2, price: "$120", event: "Concert A" },
            { name: "Jane Smith", qty: 1, price: "$60", event: "Concert B" },
          ].map((row, idx) => (
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

// Revenue Chart
const RevenueChart = () => (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <h3 className="text-lg font-bold mb-4">Revenue Trends (Last 12 Months)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
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

// Demographics Chart
const DemographicsChart = () => (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <h3 className="text-lg font-bold mb-4">Attendee Demographics</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={demographicsData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {demographicsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <OverviewCards />
        <AttendeeTable />
        <RevenueChart />
        <DemographicsChart />
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";

const Topbar = () => {
  const userName = "Event Organizer";

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-semibold text-gray-800">Report {userName}</h1>
      <Link href="/create-event">
        <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-4 py-2 rounded-lg transition-colors">
          + Create Event
        </button>
      </Link>
    </div>
  );
};

export default Topbar;

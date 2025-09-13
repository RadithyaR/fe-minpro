"use client";

import Link from "next/link";
import { FileBarChart2 } from "lucide-react";

const Topbar = () => {
  const userName = "Event Organizer";

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Title + Icon */}
      <div className="flex items-center gap-2">
        <FileBarChart2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Report <span className="text-blue-600">{userName}</span>
        </h1>
      </div>

      {/* Action Button */}
      <Link href="/create-event">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all">
          + Create Event
        </button>
      </Link>
    </div>
  );
};

export default Topbar;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  HomeIcon,
  Squares2X2Icon,
  CalendarIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
    { href: "/dashboard/transaction_management", label: "Transactions", icon: CurrencyDollarIcon },
    { href: "/dashboard/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <Link href="/" className="relative w-[300px] h-[150px] block">
          <Image
            src="/static/logo-blue.webp"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Nav */}
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

export default Sidebar;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  HomeIcon,
  Squares2X2Icon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/dashboard", label: "Dashboard", icon: Squares2X2Icon },
    { href: "/dashboard/events", label: "Events", icon: CalendarIcon },
    { href: "/dashboard/transactions", label: "Transactions", icon: CurrencyDollarIcon },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <Link href="/" className="relative w-[200px] h-[170px] block">
            <Image
              src="/static/logo-blue.webp"
              alt="Logo"
              fill
              sizes="200px"   // ✅ tambahin ini
              className="object-contain"
              priority
            />
          </Link>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  active
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Version Info (optional) */}
      <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} EventKu
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";

import { useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { user, accounts, signOut, initUser, switchRole } = useAuthStore();

  useEffect(() => {
    initUser();
  }, [initUser]);

  // Menu sesuai role
  const renderRoleMenu = () => {
    if (!user) return null;

    if (user.role === "event_organizer") {
      return (
        <>
          <MenuItem>
            <Link
              href="/dashboard"
              className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Dashboard
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              href="/settings"
              className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Pengaturan
            </Link>
          </MenuItem>
        </>
      );
    }

    if (user.role === "customer") {
      return (
        <>
          <MenuItem>
            <Link
              href="/tickets"
              className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Tiket Saya
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              href="/settings"
              className="block w-full text-left px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Pengaturan
            </Link>
          </MenuItem>
        </>
      );
    }

    return null;
  };

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="w-full max-w-[1440px] h-[60px] mx-auto px-5">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="relative w-[150px] h-[70px]">
              <Link href="/" className="block h-full w-full">
                <Image
                  src="/static/logo-blue.webp"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </Link>
            </div>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Kalau role Event Organizer, tampilkan tombol Create Event */}
                {user.role === "event_organizer" && (
                  <Link href="/create-event">
                    <button className="text-white bg-[#55AFF8] hover:bg-[#3B82F6] font-semibold rounded-lg text-sm px-4 py-2 transition-colors duration-200">
                      Create Event
                    </button>
                  </Link>
                )}

                <Menu as="div" className="relative">
                  <MenuButton className="focus:outline-none">
                    <UserCircleIcon className="w-8 h-8 text-gray-700 cursor-pointer" />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <MenuItems
                      anchor="bottom end"
                      className="mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-10 focus:outline-none"
                    >
                      {/* Username */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role.replace("_", " ")}
                        </p>
                      </div>

                      {/* Switch akun */}
                      {accounts
                        .filter((acc) => acc.role !== user.role)
                        .map((acc) => (
                          <MenuItem key={acc.role}>
                            <button
                              onClick={() => switchRole(acc.role)}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700
                                         data-[focus]:bg-gray-50 data-[focus]:text-[#55AFF8]
                                         transition duration-200 ease-in-out"
                            >
                              Beralih ke{" "}
                              {acc.role === "event_organizer"
                                ? "Event Organizer"
                                : "Customer"}
                            </button>
                          </MenuItem>
                        ))}

                      {/* Role-specific menu */}
                      <div className="border-t border-gray-100 mt-2">
                        {renderRoleMenu()}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-2">
                        <MenuItem>
                          <button
                            onClick={signOut}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-red-500
                                       data-[focus]:bg-gray-50 data-[focus]:text-red-600
                                       transition duration-200 ease-in-out"
                          >
                            Keluar
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </>
            ) : (
              //button Sign In & Sign Up
              <>
                <Link href="/sign-in">
                  <button className="text-white bg-[#55AFF8] hover:bg-[#3B82F6] font-medium rounded-lg text-sm px-4 py-2 transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>

                <Link href="/sign-up">
                  <button className="text-white bg-[#55AFF8] hover:bg-[#3B82F6] font-medium rounded-lg text-sm px-4 py-2 transition-colors cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

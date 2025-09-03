"use client";

import Link from "next/link";
import Image from "next/image";
import { navs } from "./static";
// import { userAuthStore } from "@/store/authStore";

const Navbar = () => {
  // const { user, signOut } = userAuthStore();

  // console.log(user);

  return (
    <div className="w-full border-b border-gray-200">
      <div className="w-full max-w-[1440px] h-[60px] mx-auto px-5">
        <div className="w-full h-full flex items-center">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-8">
              <div className="relative w-[150px] h-[70px]">
                <Link href="/">
                  <Image
                    src="/static/logo-blue.webp"
                    alt="Logo"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Link>
              </div>

              <div className="flex flex-row items-center gap-[30px]">
                {navs.map((nav) => (
                  <Link key={nav.id} href={nav.url}>
                    <h2 className="text-sm leading-[24px] text-gray-500 uppercase font-sans font-medium">
                      {nav.label}
                    </h2>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Link href="/sign-in">
                <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-[8px_16px] focus:outline-none  cursor-pointer">
                  <p className="p-0 font-sans text-base text-white">Sign In</p>
                </button>
              </Link>

              <Link href="/sign-up">
                <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-[8px_16px] focus:outline-none  cursor-pointer">
                  <p className="p-0 font-mono text-base text-white">Sign Up</p>
                </button>
              </Link>
            </div>
            {/* {user.username ? (
              <div className="flex flex-row gap-2 items-center">
                <p className="text-base text-black font-mono">
                  Halo, {user.username}
                </p>

                <button
                  className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-[8px_16px] focus:outline-none  cursor-pointer"
                  onClick={() => signOut()}
                >
                  <p className="p-0 font-sans text-base text-white">Log Out</p>
                </button>
              </div>
            ) : (
              <div className="flex flex-row gap-2 items-center">
                <Link href="/sign-in">
                  <button className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-[8px_16px] focus:outline-none  cursor-pointer">
                    <p className="p-0 font-sans text-base text-white">
                      Sign In
                    </p>
                  </button>
                </Link>

                <Link href="/sign-up">
                  <button className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-[8px_16px] focus:outline-none  cursor-pointer">
                    <p className="p-0 font-mono text-base text-white">
                      Sign Up
                    </p>
                  </button>
                </Link>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

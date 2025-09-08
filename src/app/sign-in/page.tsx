"use client";

import React, { useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore(); // update Zustand store

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const { token, user, accounts } = res.data;

      // Simpan token
      localStorage.setItem("token", token);

      // Handle multiple accounts
      if (accounts) {
        localStorage.setItem("accounts", JSON.stringify(accounts));
        const activeAccount =
          accounts.find((a: any) => a.role === "event_organizer") ||
          accounts[0];
        localStorage.setItem("activeAccount", JSON.stringify(activeAccount));
      }

      // ✅ Update Zustand store (otomatis juga simpan ke localStorage lewat signIn)
      signIn(user, accounts);

      console.log("User after login:", user);

      // Redirect ke homepage / dashboard
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Login
        </h1>

        {errorMessage && (
          <div className="mb-4 rounded-xl border bg-red-50 border-red-200 text-red-800 p-4 shadow-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 pr-12 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 animate-fade-in" />
              ) : (
                <EyeIcon className="h-5 w-5 animate-fade-in" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <p className="mt-4 text-center text-sm text-gray-500">
          <a
            href="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot password?
          </a>
        </p>

        <p className="mt-2 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

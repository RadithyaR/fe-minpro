"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // validasi realtime
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email wajib diisi.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Format email tidak valid.";
    }
    if (name === "password") {
      if (!value) error = "Password wajib diisi.";
      else if (value.length < 6) error = "Password minimal 6 karakter.";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    validateField("email", email);
    validateField("password", password);

    if (errors.email || errors.password) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const { token, user, accounts, eventId } = res.data;

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: user.id,
          token: token,
          role: user.role,
          eventId: eventId,
        })
      );

      if (accounts) {
        localStorage.setItem("accounts", JSON.stringify(accounts));
        const activeAccount =
          accounts.find((a: any) => a.role === "event_organizer") || accounts[0];
        localStorage.setItem("activeAccount", JSON.stringify(activeAccount));
      }

      signIn(user, accounts);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error ||
          "Email atau password salah. Coba lagi ya ✨"
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        
        {/* Branding */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500 leading-snug">
            Masuk untuk melanjutkan ke dashboard
          </p>
        </div>


        {/* Error Global */}
        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm pr-12 transition focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading && (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 flex justify-between text-sm text-gray-500">
          <a
            href="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </a>
          <a
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

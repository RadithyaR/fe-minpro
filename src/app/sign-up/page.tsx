"use client";

import React, { useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setCouponMessage("");

    try {
      const res = await axios.post("http://localhost:8000/auth/register", {
        fullName,
        email,
        password,
        referralCode: referral || undefined,
      });

      // Set message sukses
      setMessage(`✅ Akun berhasil dibuat! Ini Referral code Anda: ${res.data.referralCode}`);

      // Jika ada coupon (user pakai referral), tampilkan
      if (res.data.couponNominal) {
        setCouponMessage(`🎁 Anda mendapatkan coupon senilai ${res.data.couponNominal} IDR, berlaku 3 bulan!`);
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setReferral("");
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Create Account</h1>

        {/* Feedback Message */}
        {message && message.startsWith("✅") && (
          <div className="flex flex-col items-center justify-center mb-6 p-6 bg-green-50 border border-green-200 rounded-xl text-center shadow-sm">
            <h2 className="text-green-800 font-bold text-xl mb-2">Account berhasil dibuat!</h2>
            <p className="text-green-700 mb-2">Your referral code:</p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="font-mono bg-green-100 px-3 py-1 rounded text-green-900">
                {message.split(": ")[1]}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(message.split(": ")[1])}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Copy
              </button>
            </div>

            {/* Coupon message */}
            {couponMessage && <p className="mt-2 text-yellow-800">{couponMessage}</p>}
          </div>
        )}

        {message && message.startsWith("❌") && (
          <div className="mb-4 rounded-xl border bg-red-50 border-red-200 text-red-800 p-4 shadow-sm text-center">
            {message.replace(/^❌ /, "")}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition"
            required
          />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Referral Code (optional)"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

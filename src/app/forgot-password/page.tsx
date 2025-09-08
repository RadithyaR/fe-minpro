"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:8000/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Forgot Password</h1>

        {/* Error */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border bg-red-50 border-red-200 text-red-800 p-4 shadow-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="mb-4 rounded-xl border bg-green-50 border-green-200 text-green-800 p-4 shadow-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-100 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import axios from "axios";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

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

  const inputWrapper = (icon: React.ReactNode, input: React.ReactNode) => (
    <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring focus-within:ring-blue-200 transition">
      <div className="mr-2 text-gray-400">{icon}</div>
      <div className="flex-1">{input}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h1>

        {/* Feedback */}
        {errorMessage && (
          <div className="mb-4 p-4 text-center rounded-xl bg-red-50 border border-red-200 text-red-800">
            {errorMessage}
          </div>
        )}
        {message && (
          <div className="mb-4 p-4 text-center rounded-xl bg-green-50 border border-green-200 text-green-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputWrapper(
            <EnvelopeIcon className="h-5 w-5" />,
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-none focus:ring-0 focus:outline-none text-sm"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            title={!email ? "Please enter your email" : ""}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Back to{" "}
          <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

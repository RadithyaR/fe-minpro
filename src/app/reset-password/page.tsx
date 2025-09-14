"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: "Weak", color: "bg-red-500", value: 25 };
    if (score === 2) return { label: "Fair", color: "bg-yellow-500", value: 50 };
    if (score === 3) return { label: "Good", color: "bg-blue-500", value: 75 };
    return { label: "Strong", color: "bg-green-600", value: 100 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage(res.data.message);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const inputWrapper = (icon: React.ReactNode, input: React.ReactNode) => (
    <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring focus-within:ring-blue-200 transition">
      <div className="mr-2 text-gray-400">{icon}</div>
      <div className="flex-1">{input}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Reset Password</h1>

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
          {/* New Password */}
          {inputWrapper(
            <LockClosedIcon className="h-5 w-5" />,
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-none focus:ring-0 focus:outline-none text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          )}

          {newPassword && (
            <div className="mt-1">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Strength: <span className={passwordStrength.color.replace("bg-", "text-")}>{passwordStrength.label}</span>
              </p>
            </div>
          )}

          {/* Confirm Password */}
          {inputWrapper(
            <LockClosedIcon className="h-5 w-5" />,
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-none focus:ring-0 focus:outline-none text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 transition-all"
            title={!newPassword || !confirmPassword ? "Fill all fields" : ""}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

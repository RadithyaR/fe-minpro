"use client";

import React, { useState } from "react";
import axios from "axios";
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "fullName") {
      if (!value.trim()) error = "Full name is required.";
      else if (value.trim().length < 3) error = "At least 3 characters required.";
    }

    if (name === "email") {
      if (!value) error = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Invalid email format.";
    }

    if (name === "password") {
      if (!value) error = "Password is required.";
      else if (value.length < 6) error = "Password must be at least 6 characters.";
    }

    if (name === "confirmPassword") {
      if (!value) error = "Please confirm your password.";
      else if (value !== password) error = "Passwords do not match.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    validateField("fullName", fullName);
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);

    if (Object.values(errors).some((err) => err)) return;

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

      setMessage(`✅ Akun berhasil dibuat! Ini Referral code Anda: ${res.data.referralCode}`);

      if (res.data.couponNominal) {
        setCouponMessage(
          `🎁 Anda mendapatkan coupon senilai ${res.data.couponNominal} IDR, berlaku 3 bulan!`
        );
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setReferral("");
      setErrors({});
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const isFormInvalid =
    !fullName || !email || !password || !confirmPassword || Object.values(errors).some((err) => err);

  const inputWrapper = (icon: React.ReactNode, input: React.ReactNode) => (
    <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring focus-within:ring-blue-200 transition">
      <div className="mr-2 text-gray-400">{icon}</div>
      <div className="flex-1">{input}</div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>

        {/* Feedback */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-center ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.startsWith("✅") ? (
              <>
                <div className="font-semibold mb-2">Account berhasil dibuat!</div>
                <div className="flex justify-center items-center gap-2 mb-2">
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
                {couponMessage && <div className="text-yellow-800">{couponMessage}</div>}
              </>
            ) : (
              <p>{message.replace(/^❌ /, "")}</p>
            )}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          {inputWrapper(
            <UserIcon className="h-5 w-5" />,
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                validateField("fullName", e.target.value);
              }}
              className="w-full border-none focus:ring-0 focus:outline-none text-sm"
            />
          )}
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

          {/* Email */}
          {inputWrapper(
            <EnvelopeIcon className="h-5 w-5" />,
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              className="w-full border-none focus:ring-0 focus:outline-none text-sm"
            />
          )}
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Password */}
          {inputWrapper(
            <LockClosedIcon className="h-5 w-5" />,
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
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
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {password && (
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
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
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
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          {/* Referral */}
          <input
            type="text"
            placeholder="Referral Code (optional)"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200 transition"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isFormInvalid}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
            title={isFormInvalid ? "Please fill all fields correctly" : ""}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/sign-in" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

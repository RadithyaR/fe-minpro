"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { toast } from "sonner";

type UserProfile = {
  name: string;
  phone: string;
  bio: string;
  avatar: string | File;
};

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "/default-avatar.png";
  return avatar.startsWith("http")
    ? avatar
    : `${process.env.NEXT_PUBLIC_API_URL}/${avatar}`;
};

export default function SettingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
  });

  const [preview, setPreview] = useState<string>(""); // buat preview avatar baru
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // validasi real-time
  const validate = (field: string, value: string) => {
    let error = "";
    if (field === "name" && !value.trim()) {
      error = "Nama wajib diisi.";
    }
    if (field === "phone") {
      if (!/^\d+$/.test(value)) {
        error = "Nomor HP hanya boleh angka.";
      } else if (value.length < 10) {
        error = "Nomor HP minimal 10 digit.";
      }
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  useEffect(() => {
    const acc = localStorage.getItem("activeAccount");
    if (!acc) {
      router.push("/sign-in");
      return;
    }

    try {
      const parsed = JSON.parse(acc);
      if (!parsed.token) {
        router.push("/sign-in");
        return;
      }
      setToken(parsed.token);

      const fetchProfile = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${parsed.token}` },
            }
          );
          if (!res.ok) throw new Error("Unauthorized");
          const data = await res.json();

          setProfile({
            name: data.user?.fullName || "",
            phone: data.user?.phone || "",
            bio: data.user?.bio || "",
            avatar: data.user?.profilePicture || "",
          });
        } catch (err) {
          console.error(err);
          router.push("/sign-in");
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } catch (e) {
      console.error("activeAccount invalid", e);
      router.push("/sign-in");
    }
  }, [router]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("fullName", profile.name);
    formData.append("phone", profile.phone);
    formData.append("bio", profile.bio);
    if (profile.avatar instanceof File) {
      formData.append("profilePicture", profile.avatar);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("✅ Profile berhasil diperbarui 🎉");

        const acc = localStorage.getItem("activeAccount");
        if (acc) {
          const parsed = JSON.parse(acc);
          parsed.user = data.user;
          localStorage.setItem("activeAccount", JSON.stringify(parsed));
        }

        setShowConfirm(false);
        setTimeout(() => {
          router.push("/settings");
        }, 1200);
      } else {
        toast.error("❌ Update profile gagal. Coba lagi nanti.");
      }
    } catch (error) {
      toast.error("⚠️ Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const isFormValid =
    profile.name.trim() &&
    profile.phone.trim() &&
    !errors.name &&
    !errors.phone;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex justify-center items-start p-10">
          <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border">
            <CardContent className="space-y-8">
              <Skeleton className="w-28 h-28 rounded-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 flex justify-center items-start p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white shadow-xl rounded-2xl border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-white py-8">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <p className="text-sm opacity-80 mt-1">
                  Update informasi pribadi & avatar kamu
                </p>
              </div>

              {/* Body */}
              <CardContent className="mt-6 space-y-8 p-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group w-28 h-28">
                    <img
                      src={
                        preview
                          ? preview
                          : profile.avatar && typeof profile.avatar === "string"
                          ? getAvatarUrl(profile.avatar)
                          : "/default-avatar.png"
                      }
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-80 transition duration-300"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 rounded-full cursor-pointer"
                    >
                      <span className="text-white text-sm font-medium">
                        Ganti Foto
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProfile((prev) => ({ ...prev, avatar: file }));
                          setPreview(URL.createObjectURL(file)); // langsung preview
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Nama */}
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      validate("name", e.target.value);
                    }}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* No HP */}
                <div className="space-y-2">
                  <Label>No. Handphone</Label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => {
                      setProfile((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      validate("phone", e.target.value);
                    }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={4}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowConfirm(true)}
                    disabled={!isFormValid || saving}
                    className="rounded-xl px-6 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "⏳ Menyimpan..." : "💾 Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Popup Konfirmasi */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              ⚠️ Konfirmasi Update
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Apakah kamu yakin ingin memperbarui profile?
          </p>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => {
                setShowConfirm(false);
                router.push("/settings");
              }}
              className="rounded-lg"
            >
              ❌ Tidak
            </Button>
            <Button
              disabled={saving}
              onClick={() => {
                handleSave();
              }}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              {saving ? "⏳ Menyimpan..." : "✅ Iya, Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
  });

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
        toast.success("Profile berhasil diperbarui 🎉");

        const acc = localStorage.getItem("activeAccount");
        if (acc) {
          const parsed = JSON.parse(acc);
          parsed.user = data.user;
          localStorage.setItem("activeAccount", JSON.stringify(parsed));
        }
      } else {
        toast.error("Update profile gagal. Coba lagi nanti.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start p-10">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Profile Settings
            </CardTitle>
            <p className="text-sm text-center text-gray-500 mt-2">
              Update informasi pribadi dan avatar kamu
            </p>
          </CardHeader>

          <CardContent className="mt-6 space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={
                  profile.avatar && typeof profile.avatar === "string"
                    ? getAvatarUrl(profile.avatar)
                    : "/default-avatar.png"
                }
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border shadow-sm"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    avatar: e.target.files?.[0] as File,
                  }))
                }
                className="w-52 text-sm"
              />
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm">Nama Lengkap</Label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>

            {/* No HP */}
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm">No. Handphone</Label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-gray-600 text-sm">Bio</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={4}
                className="rounded-xl"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl px-6 font-semibold"
              >
                {saving ? "⏳ Menyimpan..." : "💾 Simpan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

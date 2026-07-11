"use client";

import { useEffect, useState } from "react";
import { Pencil, LogOut, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usersApi } from "@/lib/api";
import type { UserResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await usersApi.getMe();
        setProfile(data);
        setBio(data.bio ?? "");
        setAvatar(data.avatar ?? "");
      } catch (err) {
        setError("Profilni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleCancel = () => {
    if (!profile) return;
    setBio(profile.bio ?? "");
    setAvatar(profile.avatar ?? "");
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await usersApi.updateMe({ bio, avatar });
      setProfile(updated);
    } catch (err) {
      setError("Saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={28} />
      </div>
    );
  }

  const initial = profile?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-16 px-4">
      {/* Avatar */}
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={profile?.username}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white">
            {initial}
          </div>
        )}
        <button
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background"
          onClick={() => {
            /* Avatar URL pastdagi input orqali o'zgartiriladi. */
          }}
        >
          <Pencil size={14} className="text-primary-foreground" />
        </button>
      </div>

      <h1 className="mt-4 text-xl font-bold">{profile?.username}</h1>
      <p className="text-sm text-green-500">@{profile?.username}</p>

      {/* Form card */}
      <Card className="w-full max-w-md mt-8">
        <CardContent className="pt-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="username">Username</Label>
              <span className="text-xs text-muted-foreground">
                O'zgartirib bo'lmaydi
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                @
              </span>
              <Input
                id="username"
                value={profile?.username ?? ""}
                disabled
                className="pl-7"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="mb-2 block">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="O'zingiz haqingizda qisqacha yozing..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <span className="text-xs text-muted-foreground">Ixtiyoriy</span>
            </div>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              Bekor
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 animate-spin" size={16} />}
              Saqlash
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full max-w-md mt-6 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
      >
        <LogOut size={16} className="mr-2" />
        Chiqish
      </Button>
    </div>
  );
}

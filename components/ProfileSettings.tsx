"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Globe,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, saveUserSession, type SessionUser } from "@/lib/session";

type SettingsTab = "profile" | "security";

type ProfileSettingsProps = {
  user: SessionUser;
  onClose?: () => void;
  isOpen?: boolean;
  onUserUpdated?: (user: SessionUser) => void;
  mode?: "modal" | "page";
  initialTab?: SettingsTab;
};

export default function ProfileSettings({
  user,
  onClose,
  isOpen = true,
  onUserUpdated,
  mode = "modal",
  initialTab = "profile",
}: ProfileSettingsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [message, setMessage] = useState({ tone: "neutral", body: "" });
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline || "",
    bio: user.bio || "",
    country: user.country || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setFormData({
      name: user.name,
      headline: user.headline || "",
      bio: user.bio || "",
      country: user.country || "",
      avatarUrl: user.avatarUrl || "",
    });
  }, [user]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        avatarUrl: typeof reader.result === "string" ? reader.result : previous.avatarUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setMessage({ tone: "neutral", body: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save profile");
      }

      const nextUser = buildUserProfile(data.user);
      saveUserSession(nextUser);
      onUserUpdated?.(nextUser);
      setMessage({ tone: "success", body: "Profile saved successfully and synced live." });
    } catch (error) {
      console.error(error);
      setMessage({ tone: "danger", body: "Profile update failed. Make sure the backend server is running." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    setIsSavingPassword(true);
    setMessage({ tone: "neutral", body: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/profile/${user.id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ tone: "success", body: data.message || "Password updated successfully." });
    } catch (error) {
      console.error(error);
      setMessage({ tone: "danger", body: error instanceof Error ? error.message : "Password update failed." });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SC";

  const messageClass =
    message.tone === "success"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
      : message.tone === "danger"
        ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
        : "border-cyan-300/15 bg-cyan-300/8 text-cyan-100";

  const shell = (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,14,24,0.98),rgba(4,8,16,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(61,210,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,88,88,0.14),transparent_25%)]" />

      <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Profile settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Live-edit your account identity, avatar, and security from one place.
          </p>
        </div>
        {mode === "modal" ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Back to dashboard
          </button>
        )}
      </div>

      <div className="relative flex gap-3 border-b border-white/10 px-6 pt-4">
        {(["profile", "security"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-2 pb-3 text-sm transition ${
              activeTab === tab
                ? "border-cyan-300 text-cyan-200"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab === "profile" ? "Profile" : "Security"}
          </button>
        ))}
      </div>

      <div className="relative p-6">
        {message.body ? (
          <div className={`mb-5 rounded-[18px] border px-4 py-3 text-sm ${messageClass}`}>{message.body}</div>
        ) : null}

        {activeTab === "profile" ? (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4 rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {formData.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.avatarUrl}
                      alt={formData.name}
                      className="h-24 w-24 rounded-[26px] object-cover ring-2 ring-cyan-300/30"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-[26px] bg-[linear-gradient(135deg,#62ffb6,#3dd2ff)] text-3xl font-bold text-slate-950">
                      {initials}
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-slate-950/90 text-cyan-100 transition hover:bg-slate-900">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">{formData.name || "SmartCode User"}</p>
                  <p className="mt-1 text-sm text-cyan-100">{formData.headline || "Competitive programmer"}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">Live preview</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Rank</p>
                  <p className="mt-2 text-2xl font-semibold text-white">#{user.rank || "-"}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Points</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{user.points}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Solved</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{user.solvedProblems}</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Accepted</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{user.acceptedSubmissions}</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm leading-6 text-slate-200">
                Your changes save to MongoDB and update the active session immediately, so the navbar and profile surfaces stay in sync.
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <UserIcon className="h-4 w-4 text-cyan-200" />
                  Display name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-rose-200" />
                  Headline
                </span>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-amber-200" />
                  Email
                </span>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-[18px] border border-white/10 bg-[#030812]/70 px-4 py-3 text-slate-400 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Bio</span>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                    <Globe className="h-4 w-4 text-emerald-200" />
                    Country
                  </span>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                    <Camera className="h-4 w-4 text-cyan-200" />
                    Avatar URL
                  </span>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#62ffb6,#3dd2ff)] px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-200" />
                <h3 className="text-lg font-medium">Security center</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Change your password with current-password verification. This project still uses a simple auth model, but the full flow now works end to end.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-[18px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Account email</p>
                  <p className="mt-2 font-medium text-white">{user.email}</p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Member since</p>
                  <p className="mt-2 font-medium text-white">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently joined"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-[26px] border border-white/10 bg-white/5 p-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  <Lock className="h-4 w-4 text-amber-200" />
                  Current password
                </span>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">New password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-[18px] border border-white/10 bg-[#030812] px-4 py-3 text-white outline-none transition focus:border-cyan-300/45"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSavePassword}
                disabled={isSavingPassword}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/12 px-5 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-400/18 disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (mode === "page") {
    return shell;
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-5xl">{shell}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

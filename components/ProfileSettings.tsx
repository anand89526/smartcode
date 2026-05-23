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
      ? "border-emerald-400/20 bg-emerald-400/12 text-emerald-900"
      : message.tone === "danger"
        ? "border-rose-400/20 bg-rose-400/12 text-rose-900"
        : "border-black/10 bg-black/4 text-[var(--foreground)]";

  const shell = (
    <div className="relative overflow-hidden rounded-[30px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,242,234,0.94))] shadow-[0_40px_120px_rgba(23,23,25,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(121,242,221,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(246,179,215,0.14),transparent_25%)]" />

      <div className="relative flex items-center justify-between border-b border-black/8 px-6 py-5">
        <div>
          <h2 className="font-mono text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">Profile settings</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Live-edit your account identity, avatar, and security from one place.
          </p>
        </div>
        {mode === "modal" ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-full border border-black/12 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white hover:shadow-md"
          >
            Back to dashboard
          </button>
        )}
      </div>

      <div className="relative flex gap-3 border-b border-black/8 px-6 pt-4">
        {(["profile", "security"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-2 pb-3 text-sm font-medium transition ${
              activeTab === tab
                ? "border-[var(--foreground)] text-[var(--foreground)] font-semibold"
                : "border-transparent text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:border-black/10"
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
            <div className="space-y-4 rounded-[26px] border border-black/8 bg-white/70 p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {formData.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.avatarUrl}
                      alt={formData.name}
                      className="h-24 w-24 rounded-[26px] object-cover ring-2 ring-black/10"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-[26px] bg-[#171719] text-3xl font-bold text-[var(--accent)]">
                      {initials}
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-black/10 bg-white text-[var(--foreground)] transition hover:bg-[var(--page-bg)]">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{formData.name || "SmartCode User"}</p>
                  <p className="mt-1 text-sm text-[var(--muted-strong)]">{formData.headline || "Competitive programmer"}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Live preview</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Rank</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">#{user.rank || "-"}</p>
                </div>
                <div className="rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Points</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{user.points}</p>
                </div>
                <div className="rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Solved</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{user.solvedProblems}</p>
                </div>
                <div className="rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Accepted</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{user.acceptedSubmissions}</p>
                </div>
              </div>

              <div className="rounded-[20px] border border-black/8 bg-[#171719] p-4 text-sm leading-6 text-[#f6f4ee]">
                Your changes save to MongoDB and update the active session immediately, so the navbar and profile surfaces stay in sync.
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                  <UserIcon className="h-4 w-4 text-[var(--foreground)]" />
                  Display name
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                  <Sparkles className="h-4 w-4 text-[var(--foreground)]" />
                  Headline
                </span>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                  <Mail className="h-4 w-4 text-[var(--foreground)]" />
                  Email
                </span>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-[18px] border border-black/10 bg-black/4 px-4 py-3 text-[var(--muted)] outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[var(--muted-strong)]">Bio</span>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                    <Globe className="h-4 w-4 text-[var(--foreground)]" />
                    Country
                  </span>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                    <Camera className="h-4 w-4 text-[var(--foreground)]" />
                    Avatar URL
                  </span>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 rounded-full bg-[#171719] px-5 py-3 font-semibold text-[#f6f4ee] transition hover:scale-[1.01] disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[26px] border border-black/8 bg-white/70 p-5">
              <div className="flex items-center gap-3 text-[var(--foreground)]">
                <ShieldCheck className="h-5 w-5 text-[var(--foreground)]" />
                <h3 className="text-lg font-medium">Security center</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-strong)]">
                Change your password with current-password verification. This project still uses a simple auth model, but the full flow now works end to end.
              </p>

              <div className="mt-6 space-y-3">
                <div className="rounded-[18px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Account email</p>
                  <p className="mt-2 font-medium text-[var(--foreground)]">{user.email}</p>
                </div>
                <div className="rounded-[18px] border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-sm text-[var(--muted)]">Member since</p>
                  <p className="mt-2 font-medium text-[var(--foreground)]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently joined"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-[26px] border border-black/8 bg-white/70 p-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-strong)]">
                  <Lock className="h-4 w-4 text-[var(--foreground)]" />
                  Current password
                </span>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--muted-strong)]">New password</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[var(--muted-strong)]">Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-[18px] border border-black/10 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-black/18"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSavePassword}
                disabled={isSavingPassword}
                className="inline-flex items-center gap-2 rounded-full bg-[#171719] px-5 py-3 font-semibold text-[#f6f4ee] transition hover:bg-black/90 disabled:opacity-70"
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
            className="fixed inset-0 z-40 bg-black/28 backdrop-blur-sm"
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

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedShell from "@/components/ProtectedShell";
import ProfileSettings from "@/components/ProfileSettings";
import { getUserSession, type SessionUser } from "@/lib/session";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SessionUser | null>(() => getUserSession());

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [router, user?.id]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-white">
        Loading settings...
      </div>
    );
  }

  const activeTab = searchParams.get("tab") === "security" ? "security" : "profile";

  return (
    <ProtectedShell
      title="Settings"
      subtitle="Edit your SmartCode identity, profile visuals, and account security."
    >
      <ProfileSettings
        user={user}
        mode="page"
        initialTab={activeTab}
        onUserUpdated={setUser}
      />
    </ProtectedShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-[var(--foreground)]">
          Loading settings...
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}

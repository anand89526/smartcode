"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, getUserSession, saveUserSession, SessionUser } from "@/lib/session";

type ProtectedShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showHero?: boolean;
};

export default function ProtectedShell({
  title,
  subtitle,
  children,
  showHero = true,
}: ProtectedShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(() => getUserSession());

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [router, user]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const activeUserId = user.id;

    let cancelled = false;

    async function pingPresence() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/presence/${activeUserId}`, {
          method: "POST",
        });
        const data = await response.json();

        if (!cancelled && response.ok && data.user) {
          const nextUser = buildUserProfile(data.user);
          setUser(nextUser);
          saveUserSession(nextUser);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void pingPresence();
    const interval = window.setInterval(() => {
      void pingPresence();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user?.id]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
          className="h-14 w-14 rounded-full border-2 border-white/20 border-t-[var(--accent)]"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(61,210,255,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(255,184,77,0.18),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(98,255,182,0.16),_transparent_30%)]" />
      <Navbar variant="app" user={user} />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showHero ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(8,15,40,0.45)] backdrop-blur"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
              Welcome back
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                  {subtitle}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
                <span className="text-slate-400">Active profile:</span>{" "}
                <span className="font-medium text-cyan-200">{user.email}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
        {children}
      </main>
    </div>
  );
}

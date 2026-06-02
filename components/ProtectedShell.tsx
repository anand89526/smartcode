"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, getUserSession, saveUserSession, SessionUser } from "@/lib/session";

type ProtectedShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showHero?: boolean;
  fullWidth?: boolean;
};

export default function ProtectedShell({
  title,
  subtitle,
  children,
  showHero = true,
  fullWidth = false,
}: ProtectedShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(() => getUserSession());
  const reduceMotion = useReducedMotion();

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
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-[var(--foreground)]">
        <motion.div
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
          className="h-14 w-14 rounded-full border-2 border-black/10 border-t-[var(--surface-dark)]"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--foreground)]">
      <div className="aurora-sweep" />
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(121,242,221,0.2),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(246,179,215,0.14),_transparent_22%),radial-gradient(circle_at_bottom,_rgba(23,23,25,0.05),_transparent_28%)]" />
      <div className="soft-float pointer-events-none absolute left-[4%] top-32 h-40 w-40 rounded-full bg-[rgba(121,242,221,0.18)] blur-3xl" />
      <div className="soft-float pointer-events-none absolute right-[6%] top-64 h-52 w-52 rounded-full bg-[rgba(246,179,215,0.16)] blur-3xl [animation-delay:-2.8s]" />
      <Navbar variant="app" user={user} />
      <main className={`relative z-10 mx-auto w-full ${fullWidth ? 'h-full p-0' : 'max-w-7xl px-4 py-8 sm:px-6 lg:px-8'}`}>
        {showHero ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            className="mb-6 rounded-[28px] border border-black/8 bg-[rgba(255,255,255,0.78)] p-5 shadow-[0_28px_90px_rgba(23,23,25,0.1)] backdrop-blur-xl sm:mb-8 sm:rounded-[32px] sm:p-6"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
              Welcome back
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-mono text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--muted-strong)] sm:text-base">
                  {subtitle}
                </p>
              </div>
              <div className="rounded-[22px] border border-black/8 bg-[#171719] px-4 py-3 text-sm text-[#f6f4ee]">
                <span className="text-white/55">Active profile:</span>{" "}
                <span className="font-medium text-[var(--accent)]">{user.email}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
        {children}
      </main>
    </div>
  );
}

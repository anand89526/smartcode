"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sparkles, Settings, User, Shield, ChevronDown } from "lucide-react";
import { clearUserSession, SessionUser } from "@/lib/session";

type NavbarProps = {
  variant?: "public" | "app";
  user?: SessionUser | null;
  onProfileClick?: () => void;
};

const publicLinks = [
  { href: "/#about", label: "About" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign up" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/battle", label: "Battles" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar({ variant = "public", user, onProfileClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = variant === "app" ? appLinks : publicLinks;
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    clearUserSession();
    setIsProfileOpen(false);
    router.push("/");
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    if (onProfileClick) {
      onProfileClick();
      return;
    }

    router.push("/settings");
  };

  const handleSecurityClick = () => {
    setIsProfileOpen(false);
    router.push("/settings?tab=security");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-black/8 bg-[rgba(247,245,239,0.82)] backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-[var(--foreground)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#071018,#14151a,rgba(60,224,194,0.18))] text-[var(--accent)] shadow-[0_18px_36px_rgba(23,23,25,0.16)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-lg font-semibold leading-none tracking-[-0.02em]">SmartCode</p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Competitive Coding OS
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active =
              link.href === "/#about"
                ? false
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            const linkClass =
              variant === "app"
                ? active
                  ? "bg-[#111214] text-[#f6f4ee] shadow-[0_16px_32px_rgba(23,23,25,0.14)] font-semibold"
                  : "text-[var(--foreground)] font-medium hover:bg-[#111214]/[0.9] hover:text-[#f6f4ee]"
                : active
                  ? "bg-[#111214] text-[#f6f4ee] font-semibold"
                  : "text-[var(--foreground)] font-medium hover:bg-black/8 hover:text-[var(--foreground)]";

            return (
              <motion.div key={link.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={link.href}
                  className={`nav-link ${active ? "nav-link-active" : ""} rounded-full px-4 py-2 text-sm transition-all duration-200 ${linkClass}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}

          {variant === "app" && user ? (
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-full border border-black/12 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white hover:border-black/18 hover:shadow-md"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-black/10"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[linear-gradient(160deg,#171719,#34343b)] text-xs font-bold text-[var(--accent)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4 transition-transform" style={{ transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-[24px] border border-black/10 bg-[rgba(255,255,255,0.94)] shadow-[0_28px_80px_rgba(23,23,25,0.16)] backdrop-blur-xl"
                  >
                    <div className="border-b border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(121,242,221,0.18),transparent_45%),#f6f3ed] p-4">
                      <p className="font-semibold text-[var(--foreground)]">{user.name}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{user.headline}</p>
                    </div>

                    <div className="space-y-2 p-3">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleProfileClick}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-black/4 hover:text-[var(--foreground)]"
                      >
                        <User className="h-4 w-4 text-[var(--foreground)]" />
                        View Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => router.push("/settings")}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-black/4 hover:text-[var(--foreground)]"
                      >
                        <Settings className="h-4 w-4 text-[var(--foreground)]" />
                        Settings
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleSecurityClick}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] transition hover:bg-black/4 hover:text-[var(--foreground)]"
                      >
                        <Shield className="h-4 w-4 text-[var(--foreground)]" />
                        Security
                      </motion.button>
                    </div>

                    <div className="border-t border-black/8 p-3">
                      <motion.button
                        type="button"
                        onClick={handleLogout}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center gap-3 rounded-lg border border-black/10 bg-[#171719] px-3 py-2 text-sm text-[#f6f4ee] transition hover:bg-black/90"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </nav>
    </motion.header>
  );
}

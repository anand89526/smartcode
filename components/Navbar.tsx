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
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#62ffb6,#3dd2ff)] text-slate-950 shadow-[0_10px_30px_rgba(61,210,255,0.25)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold leading-none">SmartCode</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
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
                  ? "bg-[linear-gradient(135deg,#62ffb6,#3dd2ff)] text-slate-950 shadow-[0_8px_30px_rgba(61,210,255,0.22)]"
                  : "text-slate-200 hover:bg-cyan-300/14 hover:text-cyan-100"
                : active
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white";

            return (
              <motion.div key={link.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={link.href}
                  className={`nav-link ${active ? "nav-link-active" : ""} rounded-full px-4 py-2 text-sm transition ${linkClass}`}
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
                className="flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20 hover:border-cyan-300/50"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-cyan-300/30"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
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
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{user.headline}</p>
                    </div>

                    <div className="p-3 space-y-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-200 hover:text-white transition text-sm"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        View Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => router.push("/settings")}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-200 hover:text-white transition text-sm"
                      >
                        <Settings className="w-4 h-4 text-emerald-400" />
                        Settings
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleSecurityClick}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-200 hover:text-white transition text-sm"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Security
                      </motion.button>
                    </div>

                    <div className="p-3 border-t border-white/10">
                      <motion.button
                        type="button"
                        onClick={handleLogout}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20 transition text-sm"
                      >
                        <LogOut className="w-4 h-4" />
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

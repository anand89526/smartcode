"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Trophy,
  Zap,
  LogOut,
  Menu,
  X,
  Flame,
  Target,
} from "lucide-react";
import Link from "next/link";
import { SessionUser } from "@/lib/session";

type ProfileSidebarProps = {
  user: SessionUser | null;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
};

export default function ProfileSidebar({
  user,
  onLogout,
  open = true,
  onClose,
}: ProfileSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("stats");
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: Zap, label: "Battles", href: "/battle" },
    { icon: Target, label: "Problems", href: "/problems" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const statsData = [
    {
      label: "Solved",
      value: user?.solvedProblems ?? 0,
      change: "+3",
      icon: Target,
    },
    { label: "Rank", value: user?.rank ?? 0, change: "+5", icon: Trophy },
    { label: "Streak", value: "12", change: "Active", icon: Flame },
    { label: "Score", value: "2480", change: "+142", icon: Zap },
  ];

  const content = (
    <motion.div
      className="flex h-full flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-white"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header with close button on mobile */}
      <div className="flex items-center justify-between border-b border-white/10 p-6 lg:justify-center">
        <h2 className="text-xl font-bold">Profile</h2>
        {!open && (
          <button
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="space-y-4 border-b border-white/10 p-6">
        <motion.div
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-400/30">
            {user?.name
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2) || "SC"}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold leading-tight">{user?.name || "User"}</p>
            <p className="text-sm text-slate-400">{user?.level || "Rising Coder"}</p>
            <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandedSection(expandedSection === "rank" ? null : "rank")}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:from-cyan-500/30 hover:to-emerald-500/30"
        >
          View Full Profile
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="space-y-2 border-b border-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Quick Stats
        </p>
        <div className="grid grid-cols-2 gap-3">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg bg-slate-800/50 border border-white/5 p-3 hover:border-white/10 transition"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
                <p className="mt-2 text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-emerald-300 font-medium">{stat.change}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 space-y-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Navigation
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} whileHover={{ x: 4 }}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="border-t border-white/10 p-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30 hover:border-rose-400/50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen w-72 flex-shrink-0 fixed left-0 top-0 pt-20">
        <div className="h-full overflow-y-auto">{content}</div>
      </div>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 left-6 z-40 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 text-white shadow-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
              />
              <motion.div className="fixed bottom-0 left-0 right-0 z-40 max-h-[90vh] overflow-y-auto rounded-t-3xl lg:hidden">
                {content}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

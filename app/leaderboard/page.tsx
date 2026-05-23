"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProtectedShell from "@/components/ProtectedShell";
import { apiBaseUrl } from "@/lib/api";
import { getUserSession } from "@/lib/session";

type LeaderboardEntry = {
  id: string;
  name: string;
  rank: number;
  points: number;
  solvedProblems: number;
  streak: number;
  level: string;
};

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const session = getUserSession();

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/leaderboard?limit=50`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load leaderboard");
        }

        setUsers(data.leaderboard);
      } catch (requestError) {
        console.error(requestError);
        setError("Unable to load the live leaderboard right now.");
      } finally {
        setLoading(false);
      }
    }

    void loadLeaderboard();
  }, []);

  return (
    <ProtectedShell
      title="Leaderboard"
      subtitle="Live ranking based on stored user points, solved problems, and accepted submissions."
    >
      {loading ? (
        <div className="glass-card rounded-[28px] p-8 text-[var(--muted-strong)]">Loading leaderboard...</div>
      ) : error ? (
        <div className="glass-card rounded-[28px] p-8 text-rose-900">{error}</div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => {
            // Special animated top card for the #1 user
            if (index === 0 || user.rank === 1) {
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: [0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ delay: 0.06, duration: 3, repeat: Infinity }}
                  className={`leader-top leader-animate tilt-3d glass-card floating-card mx-auto max-w-3xl`}
                >
                  <div className="leader-crown">👑 TOP #1</div>
                  <div className="flex items-center gap-6">
                    <div className="rank-badge">1</div>
                    <div className="flex-1">
                      <p className="text-2xl font-extrabold text-[var(--foreground)]">{user.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted-strong)]">{user.points} pts • {user.solvedProblems} solved • {user.streak}d streak</p>
                    </div>
                    <div className="ml-4 rounded-full border px-4 py-2 text-sm font-semibold border-[#f1d49c33] bg-accent-gold text-[#7a5a2c]">
                      ⭐ {user.level}
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`glass-card rounded-[28px] p-5 ${
                  session?.id === user.id ? "border border-black/16 bg-[#171719] text-[#f6f4ee] neon-glow-cyan" : ""
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-5">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${session?.id === user.id ? "bg-white/10 text-[var(--accent)]" : "bg-[var(--surface-dark-soft)] text-[#f6f4ee] ring-1 ring-[#00000020]"}`}>
                      #{user.rank}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-[var(--foreground)]">{user.name}</p>
                      <p className={`text-sm ${session?.id === user.id ? "text-white/70" : "text-[var(--muted-strong)]"}`}>
                        <span className="font-medium text-[var(--foreground)]">{user.points} pts</span> • <span className="text-[var(--muted-strong)]">{user.solvedProblems} solved</span> • <span className="text-[var(--muted-strong)]">{user.streak}d</span>
                      </p>
                    </div>
                  </div>

                  <div className={`rounded-full border px-3 py-1 text-sm font-semibold ${session?.id === user.id ? "border-white/10 bg-white/10 text-[#f6f4ee]" : "border-[#f1d49c33] bg-accent-gold text-[#7a5a2c]"}`}>
                    <span className="inline-block mr-2 text-[12px]">⭐</span>
                    {user.level}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </ProtectedShell>
  );
}

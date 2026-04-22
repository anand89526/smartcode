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
        <div className="glass-card rounded-[28px] p-8 text-slate-300">Loading leaderboard...</div>
      ) : error ? (
        <div className="glass-card rounded-[28px] p-8 text-rose-200">{error}</div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`glass-card rounded-[28px] p-5 ${
                session?.id === user.id ? "border border-cyan-300/35 shadow-[0_0_0_1px_rgba(61,210,255,0.14)]" : ""
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <span className="rounded-full bg-cyan-400/12 px-4 py-2 text-sm text-cyan-100">
                    #{user.rank}
                  </span>
                  <div>
                    <p className="text-xl font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-300">
                      {user.points} pts | {user.solvedProblems} solved | {user.streak} day streak
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {user.level}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </ProtectedShell>
  );
}

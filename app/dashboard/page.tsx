"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Code2,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileSettings from "@/components/ProfileSettings";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, getUserSession, saveUserSession, type SessionUser } from "@/lib/session";

type DashboardData = {
  user: SessionUser;
  leaderboard: Array<SessionUser>;
  recommendedProblems: Array<{
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    points: number;
    slug: string;
  }>;
  recentSubmissions: Array<{
    id: string;
    status: "accepted" | "wrong_answer" | "runtime_error";
    createdAt: string;
    passedCount: number;
    totalCount: number;
    problem: {
      title: string;
      difficulty: "Easy" | "Medium" | "Hard";
      slug: string;
    };
  }>;
  stats: {
    totalUsers: number;
    totalProblems: number;
    totalSubmissions: number;
    acceptanceRate: number;
    onlineUsers: number;
    activeBattles: number;
    queueUsers: number;
  };
};

const difficultyTone = {
  Easy: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 font-semibold",
  Medium: "bg-amber-100 text-amber-800 ring-1 ring-amber-200 font-semibold",
  Hard: "bg-rose-100 text-rose-800 ring-1 ring-rose-200 font-semibold",
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const session = getUserSession();

    if (!session?.id) {
      router.replace("/login");
      return;
    }

    const activeSession = session;

    setUser(activeSession);

    async function loadDashboard() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/dashboard/${activeSession.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard");
        }

        const freshUser = buildUserProfile(data.user);
        saveUserSession(freshUser);
        setUser(freshUser);
        setDashboard({
          ...data,
          user: freshUser,
          leaderboard: data.leaderboard.map((entry: SessionUser) => buildUserProfile(entry)),
        });
      } catch (requestError) {
        console.error(requestError);
        setError("Unable to load live dashboard data. Check the backend server and MongoDB.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
    const interval = window.setInterval(() => {
      void loadDashboard();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] text-[var(--foreground)]">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
        <Navbar variant="app" user={user} onProfileClick={() => setIsProfileOpen(true)} />
        <ProfileSettings
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onUserUpdated={setUser}
        />
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[32px] p-8 text-rose-900">{error || "Unable to load dashboard."}</div>
        </div>
      </div>
    );
  }

  const successRate =
    dashboard.user.totalSubmissions > 0
      ? Math.round((dashboard.user.acceptedSubmissions / dashboard.user.totalSubmissions) * 100)
      : 0;

  const statCards = [
    { label: "Global Rank", value: `#${dashboard.user.rank || "-"}`, icon: Trophy, color: "from-amber-500/30 to-orange-500/30" },
    { label: "Solved Problems", value: `${dashboard.user.solvedProblems}`, icon: Code2, color: "from-cyan-500/30 to-blue-500/30" },
    { label: "Accepted Rate", value: `${successRate}%`, icon: Target, color: "from-emerald-500/30 to-lime-500/30" },
    { label: "Streak", value: `${dashboard.user.streak} days`, icon: Zap, color: "from-fuchsia-500/30 to-violet-500/30" },
  ];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
      <Navbar variant="app" user={user} onProfileClick={() => setIsProfileOpen(true)} />
      <ProfileSettings
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUserUpdated={(nextUser) => {
          setUser(nextUser);
          setDashboard((previous) => (previous ? { ...previous, user: nextUser } : previous));
        }}
      />

      <main className="relative overflow-hidden px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(121,242,221,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(246,179,215,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(23,23,25,0.05),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 overflow-hidden rounded-[36px] border border-black/8 bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_40px_120px_rgba(23,23,25,0.12)] lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-[var(--foreground)]">
                <Sparkles className="h-4 w-4" />
                Live competitive profile
              </div>
              <h1 className="mt-6 max-w-3xl font-mono text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
                {dashboard.user.name}, your coding workspace is now running on real user data.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted-strong)]">
                Every solve, point, streak, and ranking change is pulled from MongoDB, so this dashboard reflects the actual state of your platform instead of placeholder UI.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[26px] border border-black/8 bg-white/78 p-5 backdrop-blur"
                    >
                      <Icon className="h-5 w-5 text-[var(--foreground)]/70" />
                      <p className="mt-4 text-sm font-medium text-[var(--muted-strong)]">{item.label}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card-strong rounded-[32px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Profile node</p>
                  <h2 className="mt-3 text-2xl font-semibold">{dashboard.user.level}</h2>
                  <p className="mt-2 text-sm text-[var(--muted-strong)]">{dashboard.user.bio}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#171719] text-xl font-bold text-[var(--accent)]">
                  {dashboard.user.name.slice(0, 1).toUpperCase()}
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Points</p>
                  <p className="mt-2 text-3xl font-semibold">{dashboard.user.points}</p>
                  <p className="mt-2 text-sm text-[var(--muted-strong)]">
                    {dashboard.user.acceptedSubmissions} accepted out of {dashboard.user.totalSubmissions} submissions
                  </p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Platform scale</p>
                  <p className="mt-2 text-3xl font-semibold">{dashboard.stats.totalUsers}</p>
                  <p className="mt-2 text-sm text-[var(--muted-strong)]">
                    {dashboard.stats.onlineUsers} users online, {dashboard.stats.totalProblems} live problems, {dashboard.stats.totalSubmissions} submissions
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/solve"
                  className="rounded-full bg-[#111214] px-5 py-2.5 text-sm font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md"
                >
                  Start solving
                </Link>
                <Link
                  href="/leaderboard"
                  className="rounded-full border border-black/12 bg-white/90 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white hover:shadow-md"
                >
                  View leaderboard
                </Link>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[32px] p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Recommended</p>
                  <h2 className="mt-2 text-2xl font-semibold">Next problems to unlock more points</h2>
                </div>
                <Link href="/problems" className="text-sm text-[var(--foreground)] hover:text-black">
                  Browse all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {dashboard.recommendedProblems.length === 0 ? (
                  <div className="rounded-[24px] border border-black/8 bg-white/78 p-5 text-[var(--muted-strong)]">
                    You have solved every currently seeded problem. Add more problems from the backend to expand the library.
                  </div>
                ) : (
                  dashboard.recommendedProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/solve?problemId=${problem.id}`}
                      className="block rounded-[24px] border border-black/8 bg-white/78 p-5 transition hover:bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-medium text-[var(--foreground)]">{problem.title}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs ${difficultyTone[problem.difficulty]}`}>
                              {problem.difficulty}
                            </span>
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-black/8 bg-[var(--page-bg)] px-3 py-1 text-xs text-[var(--muted-strong)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--foreground)]">
                          <span className="text-sm">{problem.points} pts</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-[32px] p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Recent activity</p>
                  <h2 className="mt-2 text-2xl font-semibold">Submission timeline</h2>
                </div>
                <Activity className="h-5 w-5 text-[var(--foreground)]" />
              </div>

              <div className="mt-6 space-y-4">
                {dashboard.recentSubmissions.length === 0 ? (
                  <div className="rounded-[24px] border border-black/8 bg-white/78 p-5 text-[var(--muted-strong)]">
                    No submissions yet. Solve your first problem to start building real activity data.
                  </div>
                ) : (
                  dashboard.recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-[24px] border border-black/8 bg-white/78 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-medium">{submission.problem.title}</p>
                          <p className="mt-2 text-sm text-[var(--muted-strong)]">
                            Passed {submission.passedCount}/{submission.totalCount} tests
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            submission.status === "accepted"
                              ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 font-semibold"
                              : submission.status === "wrong_answer"
                                ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200 font-semibold"
                                : "bg-rose-100 text-rose-800 ring-1 ring-rose-200 font-semibold"
                          }`}
                        >
                          {submission.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--muted)]">
                        <span className={`rounded-full px-3 py-1 ${difficultyTone[submission.problem.difficulty]}`}>
                          {submission.problem.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {new Date(submission.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[32px] p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Platform health</p>
                  <h2 className="mt-2 text-2xl font-semibold">Real-time metrics</h2>
                </div>
                <Users className="h-5 w-5 text-[var(--foreground)]" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">Registered users</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{dashboard.stats.totalUsers}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">Users online</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{dashboard.stats.onlineUsers}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">Problem bank</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{dashboard.stats.totalProblems}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">Battles live</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{dashboard.stats.activeBattles}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm font-medium text-[var(--muted-strong)]">Battle queue</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">{dashboard.stats.queueUsers}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[32px] p-7"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Leaderboard</p>
                  <h2 className="mt-2 text-2xl font-semibold">Current top performers</h2>
                </div>
                <Link href="/leaderboard" className="inline-flex items-center gap-1 text-sm text-[var(--foreground)] hover:text-black">
                  View full
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {dashboard.leaderboard.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between rounded-[22px] border border-black/8 bg-white/78 px-5 py-4 ${
                      entry.id === dashboard.user.id ? "border-black/16 bg-[#171719] text-[#f6f4ee]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${entry.id === dashboard.user.id ? "bg-white/10 text-[var(--accent)]" : "bg-[var(--page-bg)] text-[var(--foreground)]"}`}>
                        #{entry.rank}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className={`text-sm ${entry.id === dashboard.user.id ? "text-white/68" : "text-[var(--muted-strong)]"}`}>
                          {entry.solvedProblems} solved | {entry.level}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${entry.id === dashboard.user.id ? "text-white/82" : "text-[var(--muted-strong)]"}`}>
                      <Medal className="h-4 w-4 text-[var(--accent-gold)]" />
                      <span>{entry.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}

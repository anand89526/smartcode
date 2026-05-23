"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, LoaderCircle, Swords, Trophy, Users, Zap } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ProtectedShell from "@/components/ProtectedShell";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, getUserSession, saveUserSession, type SessionUser } from "@/lib/session";

type BattleState = {
  _id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  prizePoints: number;
  createdAt: string;
  challengerId: { _id: string; name: string; points: number; rank: number };
  opponentId?: { _id: string; name: string; points: number; rank: number } | null;
  winnerId?: { _id: string; name: string } | null;
  problemId: {
    _id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    tags: string[];
    points: number;
    starterCode: Record<string, string>;
    examples: Array<{ input: string; output: string; explanation?: string }>;
    pseudocode: string;
  };
};

type BattleStats = {
  onlineUsers: number;
  activeBattles: number;
  queueUsers: number;
};

const supportedLanguages = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "java", label: "Java" },
];

export default function Battle() {
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [stats, setStats] = useState<BattleStats>({ onlineUsers: 0, activeBattles: 0, queueUsers: 0 });
  const [user, setUser] = useState<SessionUser | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("Join the queue to start a live one-v-one coding battle.");

  useEffect(() => {
    const session = getUserSession();

    if (!session?.id) {
      setLoading(false);
      return;
    }

    const activeSession = session;

    setUser(activeSession);

    async function loadState() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/battles/state/${activeSession.id}`);
        const data = await response.json();

        if (response.ok) {
          setBattle(data.battle);
          setStats(data.stats);

          if (data.user) {
            const nextUser = buildUserProfile(data.user);
            setUser(nextUser);
            saveUserSession(nextUser);
          }

          if (data.battle?.problemId?.starterCode) {
            setCodeByLanguage((previous) => ({
              javascript: previous.javascript || data.battle.problemId.starterCode.javascript || "",
              typescript: previous.typescript || data.battle.problemId.starterCode.typescript || "",
              java: previous.java || data.battle.problemId.starterCode.java || "",
            }));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadState();
    const interval = window.setInterval(() => {
      void loadState();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const currentCode = useMemo(() => codeByLanguage[selectedLanguage] || "", [codeByLanguage, selectedLanguage]);

  const handleJoinQueue = async () => {
    const session = getUserSession();
    if (!session?.id) {
      return;
    }

    setJoining(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/battles/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join battle queue");
      }

      setBattle(data.battle);
      setStats(data.stats);
      setMessage(data.message);

      if (data.battle?.problemId?.starterCode) {
        setCodeByLanguage({
          javascript: data.battle.problemId.starterCode.javascript || "",
          typescript: data.battle.problemId.starterCode.typescript || "",
          java: data.battle.problemId.starterCode.java || "",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to join the battle queue right now.");
    } finally {
      setJoining(false);
    }
  };

  const handleBattleSubmit = async () => {
    const session = getUserSession();
    if (!session?.id || !battle) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/battles/submit/${battle._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.id, code: currentCode, language: selectedLanguage }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit battle solution");
      }

      setBattle(data.battle);
      setStats(data.stats);
      setMessage(`${data.message}\n${data.result.status.toUpperCase()} - Passed ${data.result.passed}/${data.result.total}`);

      if (data.user) {
        const nextUser = buildUserProfile(data.user);
        setUser(nextUser);
        saveUserSession(nextUser);
      }
    } catch (error) {
      console.error(error);
      setMessage("Battle submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCode = (value: string) => {
    setCodeByLanguage((previous) => ({
      ...previous,
      [selectedLanguage]: value,
    }));
  };

  const opponent =
    battle && user
      ? String(battle.challengerId._id) === String(user.id)
        ? battle.opponentId
        : battle.challengerId
      : null;

  return (
    <ProtectedShell
      title="Battle arena"
      subtitle="Queue into a live one-v-one challenge, watch online traffic, and win bonus prize points that are stored in MongoDB."
    >
      {loading ? (
        <div className="glass-card rounded-[30px] p-8 text-[var(--muted-strong)]">Loading battle arena...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="glass-card rounded-[28px] p-5">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <Users className="h-4 w-4" />
                <p className="text-sm">Users online</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">{stats.onlineUsers}</p>
            </div>
            <div className="glass-card rounded-[28px] p-5">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <Swords className="h-4 w-4" />
                <p className="text-sm">Active battles</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">{stats.activeBattles}</p>
            </div>
            <div className="glass-card rounded-[28px] p-5">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <LoaderCircle className="h-4 w-4" />
                <p className="text-sm">Queue</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">{stats.queueUsers}</p>
            </div>
            <div className="glass-card rounded-[28px] p-5">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <Trophy className="h-4 w-4" />
                <p className="text-sm">Battle wins</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">{user?.battleWins ?? 0}</p>
            </div>
          </div>

          {!battle ? (
            <div className="glass-card flex min-h-[420px] flex-col items-center justify-center rounded-[34px] p-8 text-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3.4 }}
                className="mb-6 rounded-full border border-black/10 bg-white/76 px-4 py-2 text-sm text-[var(--foreground)]"
              >
                Live challenge queue
              </motion.div>
              <h2 className="font-mono text-4xl font-semibold tracking-[-0.04em]">Enter a real coding duel</h2>
              <p className="mt-4 max-w-2xl text-[var(--muted-strong)]">
                Match into a backend-tracked battle. The winner gets prize points, battle wins, and rank movement saved in MongoDB.
              </p>
              <button
                type="button"
                onClick={handleJoinQueue}
                disabled={joining}
                className="mt-8 rounded-full bg-[#111214] px-7 py-3 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md disabled:opacity-70"
              >
                {joining ? "Joining queue..." : "Join Battle Queue"}
              </button>
              <p className="mt-5 max-w-xl text-sm text-[var(--muted)]">{message}</p>
            </div>
          ) : battle.status === "pending" ? (
            <div className="glass-card rounded-[34px] p-8 text-center">
              <p className="inline-flex rounded-full border border-black/10 bg-white/74 px-4 py-2 text-sm text-[var(--foreground)]">
                Waiting room
              </p>
              <h2 className="mt-5 font-mono text-3xl font-semibold tracking-[-0.04em]">You are in the queue</h2>
              <p className="mt-4 text-[var(--muted-strong)]">
                We are waiting for another online user to accept the one-v-one battle. Keep this page open and we will auto-refresh the match state.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm text-[var(--muted)]">Battle prize</p>
                  <p className="mt-2 text-3xl font-semibold">{battle.prizePoints}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm text-[var(--muted)]">Queue users</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.queueUsers}</p>
                </div>
                <div className="rounded-[24px] border border-black/8 bg-white/78 p-5">
                  <p className="text-sm text-[var(--muted)]">Users online</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.onlineUsers}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <section className="space-y-6">
                <div className="glass-card rounded-[30px] p-6">
                  <div className="rounded-[26px] border border-black/8 bg-white/70 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Opponent</p>
                        <h2 className="mt-2 text-2xl font-semibold">{opponent?.name || "Matched player"}</h2>
                        <p className="mt-2 text-sm text-[var(--muted-strong)]">
                          Rank #{opponent?.rank || "-"} | {opponent?.points || 0} pts
                        </p>
                      </div>
                      <div className="rounded-full bg-[#171719] px-4 py-2 text-sm text-[#f6f4ee]">
                        Prize +{battle.prizePoints}
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Battle problem</p>
                        <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs text-[var(--foreground)]">
                          {battle.problemId.difficulty}
                        </span>
                        <span className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs text-[var(--foreground)]">
                          {battle.problemId.points} base pts
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold">{battle.problemId.title}</h3>
                      <p className="mt-4 text-[var(--muted-strong)]">{battle.problemId.description}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {battle.problemId.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-black/8 bg-[var(--page-bg)] px-3 py-1 text-xs text-[var(--muted-strong)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {battle.problemId.examples.slice(0, 2).map((example, index) => (
                        <div key={`${example.input}-${index}`} className="mt-5 rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                          <p className="text-sm text-[var(--foreground)]">Example {index + 1}</p>
                          <pre className="mt-3 whitespace-pre-wrap text-sm text-[var(--muted-strong)]">{`Input: ${example.input}
Output: ${example.output}`}</pre>
                        </div>
                      ))}

                      <div className="mt-5 rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4">
                        <div className="flex items-center gap-2 text-[var(--foreground)]">
                          <Zap className="h-4 w-4" />
                          <p className="text-sm">Pseudocode</p>
                        </div>
                        <pre className="mt-3 whitespace-pre-wrap text-sm text-[var(--muted-strong)]">{battle.problemId.pseudocode}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="glass-card rounded-[30px] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Battle compiler</p>
                      <h3 className="mt-2 text-2xl font-semibold">Send your solution</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {supportedLanguages.map((language) => (
                        <button
                          key={language.id}
                          type="button"
                          onClick={() => setSelectedLanguage(language.id)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            selectedLanguage === language.id
                              ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                              : "border border-black/12 bg-white/90 text-[var(--muted-strong)] hover:bg-white hover:shadow-sm"
                          }`}
                        >
                          {language.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <CodeEditor code={currentCode} language={selectedLanguage} onChange={updateCode} />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleBattleSubmit}
                      disabled={submitting}
                      className="rounded-2xl bg-[#111214] px-5 py-2.5 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md disabled:opacity-70"
                    >
                      {submitting ? "Submitting..." : "Submit Battle Solution"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCodeByLanguage((previous) => ({
                          ...previous,
                          [selectedLanguage]: battle.problemId.starterCode[selectedLanguage] || "",
                        }))
                      }
                      className="rounded-2xl border border-black/12 bg-white/90 px-5 py-2.5 font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white hover:shadow-md"
                    >
                      Reset Template
                    </button>
                  </div>
                </div>

                <div className="glass-card rounded-[28px] p-5">
                  <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <Crown className="h-4 w-4" />
                    <p className="text-sm">Battle status</p>
                  </div>
                  <pre className="mt-4 whitespace-pre-wrap rounded-[20px] border border-black/8 bg-[var(--page-bg)] p-4 text-sm text-[var(--muted-strong)]">
                    {message}
                  </pre>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </ProtectedShell>
  );
}

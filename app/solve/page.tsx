"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Code2,
  FileCode2,
  Lightbulb,
  ListChecks,
  Play,
  Send,
  Sparkles,
  Target,
  TimerReset,
  WrapText,
  XCircle,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ProblemCoach from "@/components/ProblemCoach";
import ProtectedShell from "@/components/ProtectedShell";
import { apiBaseUrl } from "@/lib/api";
import {
  buildUserProfile,
  getUserSession,
  saveUserSession,
  type SessionUser,
} from "@/lib/session";

type ProblemDetails = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  tags: string[];
  points: number;
  functionName: string;
  pseudocode: string;
  starterCode: Record<string, string | undefined>;
  supportedLanguages: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
};

type RelatedProblem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  slug: string;
};

type JudgeResponse = {
  status: "accepted" | "wrong_answer" | "runtime_error" | "compile_error";
  passed: number;
  total: number;
  expected?: unknown;
  actual?: unknown;
  error?: string;
  failedCase?: number;
};

type WorkspaceTab = "overview" | "approach" | "insights" | "related";
type MobileSection = "problem" | "editor" | "notes";

const languageLabels: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  java: "Java",
  python: "Python",
  c: "C",
  cpp: "C++",
};

const starterCodes: Record<string, string> = {
  javascript: 'function solution(nums) {\n  return [];\n}',
  typescript: 'function solution(nums: number[]): number[] {\n  return [];\n}',
  java: 'class Solution {\n  public int[] solution(int[] nums) {\n    return new int[]{};\n  }\n}',
  python: "def solution(nums):\n    return []",
  c: "#include <stdio.h>\nvoid solution(int* nums) {\n}\n",
  cpp: "#include <vector>\nusing namespace std;\n\nvector<int> solution(vector<int>& nums) {\n  return {};\n}\n",
};

const difficultyClasses: Record<ProblemDetails["difficulty"], string> = {
  Easy: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 font-semibold",
  Medium: "bg-amber-100 text-amber-800 ring-1 ring-amber-200 font-semibold",
  Hard: "bg-rose-100 text-rose-800 ring-1 ring-rose-200 font-semibold",
};

function noteStorageKey(problemId: string) {
  return `smartcode-notes-${problemId}`;
}

function formatJudgeResult(result: JudgeResponse) {
  if (result.status === "accepted") {
    return `Accepted\nPassed ${result.passed}/${result.total} tests.`;
  }

  if (result.status === "wrong_answer") {
    return `Wrong Answer\nPassed ${result.passed}/${result.total} tests.\nExpected: ${JSON.stringify(result.expected)}\nActual: ${JSON.stringify(result.actual)}`;
  }

  if (result.status === "compile_error") {
    return `Compile Error\n${result.error || "Compilation failed."}`;
  }

  return `Runtime Error\n${result.error || "Execution failed."}`;
}

function buildPatternRadar(problem: ProblemDetails) {
  const tagSet = new Set(problem.tags.map((tag) => tag.toLowerCase()));
  const radar: string[] = [];

  if ([...tagSet].some((tag) => tag.includes("array") || tag.includes("two pointer"))) {
    radar.push("Scan once before reaching for nested loops; pointer movement may encode the invariant.");
  }
  if ([...tagSet].some((tag) => tag.includes("hash") || tag.includes("map"))) {
    radar.push("A hash-based memory can replace repeated searching with direct lookup.");
  }
  if ([...tagSet].some((tag) => tag.includes("tree") || tag.includes("graph"))) {
    radar.push("Choose traversal order first, then decide what each node visit must compute.");
  }
  if ([...tagSet].some((tag) => tag.includes("dynamic") || tag.includes("dp"))) {
    radar.push("State definition is the real problem; transitions usually become easy after that.");
  }
  if ([...tagSet].some((tag) => tag.includes("string"))) {
    radar.push("Track what each index means so substring boundaries stay correct.");
  }

  if (radar.length === 0) {
    radar.push("State the brute-force idea first, then remove the most repeated expensive step.");
  }

  return radar.slice(0, 3);
}

function buildPitfalls(problem: ProblemDetails) {
  const pitfalls = [
    "Forgetting the smallest valid input and the empty-shape edge case.",
    "Writing code before naming the exact invariant each loop iteration preserves.",
    "Optimizing too early without checking the correctness of the base idea."
  ];

  if (problem.difficulty === "Hard") {
    pitfalls.unshift("Choosing an approach without comparing time and space tradeoffs for at least two strategies.");
  }

  return pitfalls;
}

function buildCheckpoints(problem: ProblemDetails) {
  return [
    `Restate the required output for ${problem.functionName || "solution"} in one sentence.`,
    "Name the data structure or state you need to remember while scanning.",
    "Dry-run one example and narrate each variable change.",
    "List two edge cases before you submit."
  ];
}

function SolvePageContent() {
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [relatedProblems, setRelatedProblems] = useState<RelatedProblem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [user, setUser] = useState<SessionUser | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("overview");
  const [mobileSection, setMobileSection] = useState<MobileSection>("problem");
  const [saved, setSaved] = useState(true);
  const [notes, setNotes] = useState("");
  const [wordWrap, setWordWrap] = useState<"on" | "off">("off");
  const [fontSize, setFontSize] = useState(14);
  const [interviewMode, setInterviewMode] = useState(false);
  const [interviewStartedAt, setInterviewStartedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [toast, setToast] = useState<{
    title: string;
    body: string;
    tone: "success" | "warning" | "danger";
    action: "run" | "submit";
  } | null>(null);

  useEffect(() => {
    const session = getUserSession();
    const problemId = searchParams.get("problemId");

    if (!session?.id || !problemId) {
      setLoading(false);
      return;
    }

    setUser(session);

    async function loadProblem() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/problems/${problemId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load problem");
        }

        const supportedLangs = ["javascript", "typescript", "java", "python", "c", "cpp"];
        const langs = data.problem.supportedLanguages?.filter((lang: string) => supportedLangs.includes(lang)) || ["javascript"];
        const allLangs = [...new Set([...langs, ...supportedLangs])].slice(0, 6);
        const nextCodeMap: Record<string, string> = {};

        allLangs.forEach((lang: string) => {
          nextCodeMap[lang] = data.problem.starterCode?.[lang] || starterCodes[lang] || "";
        });

        setProblem({ ...data.problem, supportedLanguages: allLangs });
        setRelatedProblems(data.relatedProblems || []);
        setSelectedLanguage(langs[0]);
        setCodeByLanguage(nextCodeMap);
      } catch (error) {
        console.error(error);
        setOutput("Unable to load problem.");
      } finally {
        setLoading(false);
      }
    }

    void loadProblem();
  }, [searchParams]);

  useEffect(() => {
    if (!problem || typeof window === "undefined") {
      return;
    }

    const storedNotes = window.localStorage.getItem(noteStorageKey(problem.id));
    setNotes(storedNotes || "");
  }, [problem]);

  useEffect(() => {
    if (!problem || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(noteStorageKey(problem.id), notes);
  }, [notes, problem]);

  useEffect(() => {
    if (!interviewMode || !interviewStartedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - interviewStartedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [interviewMode, interviewStartedAt]);

  const code = useMemo(() => codeByLanguage[selectedLanguage] || "", [codeByLanguage, selectedLanguage]);
  const patternRadar = useMemo(() => (problem ? buildPatternRadar(problem) : []), [problem]);
  const pitfalls = useMemo(() => (problem ? buildPitfalls(problem) : []), [problem]);
  const checkpoints = useMemo(() => (problem ? buildCheckpoints(problem) : []), [problem]);

  function showToast(title: string, body: string, tone: "success" | "warning" | "danger", action: "run" | "submit") {
    setToast({ title, body, tone, action });
    window.setTimeout(() => setToast(null), 2800);
  }

  function updateCode(value: string) {
    setSaved(false);
    setCodeByLanguage((current) => ({ ...current, [selectedLanguage]: value }));
    window.setTimeout(() => setSaved(true), 700);
  }

  async function handleRun() {
    if (!problem) {
      return;
    }

    setRunning(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problem.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: selectedLanguage })
      });
      const data = await response.json();
      setOutput(formatJudgeResult(data.result));
      setMobileSection("editor");
      if (data.result.status === "accepted") {
        showToast("Run passed", "Your current code passed the available run checks.", "success", "run");
      } else if (data.result.status === "wrong_answer") {
        showToast("Run found a mismatch", "The run completed, but the output did not match the expected result.", "warning", "run");
      } else {
        showToast("Run needs debugging", "The code ran into a compile or runtime issue.", "danger", "run");
      }
    } catch {
      setOutput("Run failed. Check backend server.");
      showToast("Run failed", "The backend did not respond successfully for the run request.", "danger", "run");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    const session = getUserSession();

    if (!problem || !session?.id) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problem.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id, code, language: selectedLanguage })
      });
      const data = await response.json();
      const nextUser = buildUserProfile(data.user);
      saveUserSession(nextUser);
      setUser(nextUser);
      setOutput(formatJudgeResult(data.result));
      setMobileSection("editor");

      if (data.result.status === "accepted") {
        const earned = Math.max(nextUser.points - (user?.points ?? 0), 0);
        showToast("Submission accepted", `Great work. You earned ${earned} points.`, "success", "submit");
      } else if (data.result.status === "wrong_answer") {
        showToast("Submission missed", "Close. Review the failing case and try again.", "warning", "submit");
      } else {
        showToast("Submission needs debugging", "The checker found an execution issue to debug.", "danger", "submit");
      }
    } catch {
      setOutput("Submit failed.");
      showToast("Submit failed", "The backend did not respond successfully.", "danger", "submit");
    } finally {
      setSubmitting(false);
    }
  }

  function resetInterviewMode() {
    setInterviewStartedAt(Date.now());
    setElapsedSeconds(0);
  }

  if (loading) {
    return (
      <ProtectedShell title="Solve" subtitle="Preparing your workspace." showHero={false}>
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="h-[70vh] animate-pulse rounded-[30px] border border-black/8 bg-white/70" />
          <div className="h-[70vh] animate-pulse rounded-[30px] border border-black/8 bg-white/70" />
        </div>
      </ProtectedShell>
    );
  }

  if (!problem) {
    return (
      <ProtectedShell title="Solve" subtitle="Open a problem from the library to start." showHero={false}>
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-8 text-slate-300">
          Select a problem from the library to open the coding workspace.
        </div>
      </ProtectedShell>
    );
  }

  return (
    <ProtectedShell title="Solve" subtitle="A focused workspace for solving, learning, and iterating." showHero={false} fullWidth>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: -24, rotateX: -35, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          className="fixed left-1/2 top-20 z-50 w-[min(92vw,430px)] -translate-x-1/2 [perspective:1200px]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "linear" }}
            className={`pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
              toast.tone === "success"
                ? "border-emerald-300/20"
                : toast.tone === "warning"
                  ? "border-amber-300/18"
                  : "border-rose-300/18"
            }`}
          />
          <motion.div
            animate={{ rotate: -360, scale: [0.94, 1.04, 0.94] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6.5, ease: "linear" }}
            className={`pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[36px] border ${
              toast.tone === "success"
                ? "border-emerald-300/10"
                : toast.tone === "warning"
                  ? "border-amber-300/10"
                  : "border-rose-300/10"
            }`}
          />
          <div
            className={`rounded-[28px] border px-5 py-5 shadow-[0_30px_100px_rgba(2,6,23,0.7)] backdrop-blur-xl ${
              toast.tone === "success"
                ? "border-emerald-300/20 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.24),transparent_35%),linear-gradient(180deg,rgba(6,24,20,0.96),rgba(2,8,23,0.98))]"
                : toast.tone === "warning"
                  ? "border-amber-300/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.2),transparent_35%),linear-gradient(180deg,rgba(27,18,5,0.96),rgba(2,8,23,0.98))]"
                  : "border-rose-300/20 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.2),transparent_35%),linear-gradient(180deg,rgba(28,8,16,0.96),rgba(2,8,23,0.98))]"
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] border ${
                toast.tone === "success"
                  ? "border-emerald-300/25 bg-emerald-300/12 text-emerald-100"
                  : toast.tone === "warning"
                    ? "border-amber-300/25 bg-amber-300/12 text-amber-100"
                    : "border-rose-300/25 bg-rose-300/12 text-rose-100"
              } shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]`}>
                {toast.tone === "success" ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.28em] ${
                  toast.tone === "success" ? "text-emerald-200" : toast.tone === "warning" ? "text-amber-200" : "text-rose-200"
                }`}>
                  {toast.action === "run" ? "Run feedback" : "Submit feedback"}
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{toast.title}</p>
              </div>
            </div>
            <p className={`text-xs uppercase tracking-[0.28em] ${
              toast.tone === "success" ? "text-emerald-200" : toast.tone === "warning" ? "text-amber-200" : "text-rose-200"
            }`}>
              {toast.tone === "success" ? "3d success state" : "3d debug state"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{toast.body}</p>
          </div>
        </motion.div>
      ) : null}

      <div className="mx-auto w-full max-w-[1600px] px-3 pb-10 pt-4 sm:px-5 lg:px-7">
        <section className="mb-4 rounded-[30px] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(121,242,221,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(246,179,215,0.12),transparent_28%),rgba(255,255,255,0.84)] p-4 shadow-[0_30px_90px_rgba(23,23,25,0.1)] sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                  <Link href="/problems" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-white">
                  <ArrowLeft className="h-4 w-4" />
                  Problem Library
                </Link>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClasses[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
                <span className="rounded-full border border-black/8 bg-[var(--page-bg)] px-3 py-1 text-xs font-medium text-[var(--muted-strong)]">
                  {problem.points} points
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  Function: {problem.functionName || "solution"}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Problem workspace</p>
                <h1 className="mt-2 font-mono text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">{problem.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-strong)]">
                  Solve with a full coding workspace, AI guidance, interview mode, and a persistent scratchpad designed for actual problem solving rather than plain code entry.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/8 bg-[var(--page-bg)] px-3 py-1 text-xs font-medium text-[var(--muted-strong)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[420px]">
                <div className="rounded-2xl border border-black/8 bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Rank</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">#{user?.rank ?? "-"}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Competitive standing</p>
              </div>
                <div className="rounded-2xl border border-black/8 bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Points</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">{user?.points ?? 0}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Account score</p>
              </div>
                <div className="rounded-2xl border border-black/8 bg-white/72 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Streak</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">{user?.streak ?? 0}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Daily momentum</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-4 flex gap-2 overflow-x-auto xl:hidden">
          {[
            { id: "problem" as const, label: "Problem", icon: BookOpenText },
            { id: "editor" as const, label: "Editor", icon: Code2 },
            { id: "notes" as const, label: "Notes", icon: FileCode2 },
          ].map((item) => {
            const Icon = item.icon;
            const active = mobileSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMobileSection(item.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                    : "border border-black/12 bg-white/90 text-[var(--muted-strong)] hover:bg-white hover:shadow-sm"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(540px,0.95fr)]">
          <section className={`${mobileSection !== "problem" ? "hidden xl:block" : ""}`}>
            <div className="rounded-[30px] border border-black/8 bg-white/78 shadow-[0_24px_70px_rgba(23,23,25,0.12)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2 border-b border-white/8 px-4 py-4 sm:px-5">
                {[
                  { id: "overview" as const, label: "Overview", icon: BookOpenText },
                  { id: "approach" as const, label: "Approach", icon: Lightbulb },
                  { id: "insights" as const, label: "Insights", icon: Sparkles },
                  { id: "related" as const, label: "Related", icon: ListChecks },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = workspaceTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setWorkspaceTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                          : "text-[var(--muted-strong)] hover:bg-black/6 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-6 p-4 sm:p-6">
                {workspaceTab === "overview" ? (
                  <>
                      <article className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5">
                        <h2 className="text-xl font-semibold text-[var(--foreground)]">Problem Statement</h2>
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-strong)]">
                        {problem.description}
                      </p>
                    </article>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {problem.examples.map((example, index) => (
                          <div key={`${example.input}-${index}`} className="rounded-[22px] border border-black/8 bg-white p-5">
                            <p className="text-sm font-semibold text-[var(--foreground)]">Example {index + 1}</p>
                            <div className="mt-4 space-y-2 text-sm text-[var(--muted-strong)]">
                            <p><span className="text-slate-500">Input:</span> {example.input}</p>
                            <p><span className="text-slate-500">Output:</span> {example.output}</p>
                            {example.explanation ? (
                              <p><span className="text-slate-500">Why:</span> {example.explanation}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                          <Target className="h-4 w-4" />
                          Pattern Radar
                        </p>
                        <div className="mt-4 space-y-3">
                          {patternRadar.map((item) => (
                            <div key={item} className="rounded-2xl border border-black/8 bg-white/80 p-4 text-sm text-[var(--muted-strong)]">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-amber-200 bg-amber-50/60 p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                          <Lightbulb className="h-4 w-4" />
                          Pitfall Scanner
                        </p>
                        <ul className="mt-4 space-y-3 text-sm text-[var(--muted-strong)]">
                          {pitfalls.map((item) => (
                            <li key={item} className="rounded-2xl border border-black/8 bg-white/80 p-4">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : null}

                {workspaceTab === "approach" ? (
                  <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                      <div className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                        <ListChecks className="h-4 w-4 text-emerald-600" />
                        Guided checkpoints
                      </p>
                      <div className="mt-4 space-y-3">
                        {checkpoints.map((item, index) => (
                          <div key={item} className="flex gap-3 rounded-2xl border border-black/8 bg-white/80 p-4 text-sm text-[var(--muted-strong)]">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              {index + 1}
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                      <div className="rounded-[24px] border border-black/8 bg-white p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        Pseudocode / idea seed
                      </p>
                      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm leading-7 text-slate-300">
                        {problem.pseudocode || "No pseudocode is available for this problem yet. Use the AI coach for guided hints and an approach walkthrough."}
                      </pre>
                    </div>
                  </div>
                ) : null}

                {workspaceTab === "insights" ? (
                  <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5">
                        <p className="text-sm font-semibold text-[var(--foreground)]">Interview Mode</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
                        A timed, distraction-light solving session that keeps you honest while the coach stays available only for guidance.
                      </p>
                    </div>
                      <div className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5">
                        <p className="text-sm font-semibold text-[var(--foreground)]">Idea Pad</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
                        Notes are saved per problem locally, so every unfinished thought and edge case stays with the question.
                      </p>
                    </div>
                      <div className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5">
                        <p className="text-sm font-semibold text-[var(--foreground)]">Smart Coach</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
                        Opens with the active question already in context and helps with patterns, logic, and edge cases without dropping the full answer.
                      </p>
                    </div>
                  </div>
                ) : null}

                {workspaceTab === "related" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedProblems.map((related) => (
                      <Link
                        key={related.id}
                        href={`/solve?problemId=${related.id}`}
                        className="rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-5 transition hover:border-black/16 hover:bg-white hover:shadow-sm"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Keep momentum</p>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{related.title}</h3>
                        <div className="mt-4 flex items-center gap-3 text-sm text-[var(--muted-strong)]">
                          <span className={`rounded-full px-3 py-1 text-xs ${difficultyClasses[related.difficulty]}`}>
                            {related.difficulty}
                          </span>
                          <span>{related.points} pts</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className={`${mobileSection !== "editor" ? "hidden xl:block" : ""}`}>
            <div className={`programmer-mode-shell ${interviewMode ? "ring-1 ring-rose-300/20" : ""}`}>
              <div className="programmer-mode-grid absolute inset-0" />
              <div className="programmer-mode-beam programmer-mode-beam-left" />
              <div className="programmer-mode-beam programmer-mode-beam-right" />
              <div className="programmer-mode-orb programmer-mode-orb-top" />
              <div className="programmer-mode-orb programmer-mode-orb-bottom" />
              <div className="relative z-10 rounded-[24px] border border-white/6 bg-[#030712]/92">
              <div className="flex flex-col gap-4 border-b border-white/8 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <Code2 className="h-4 w-4 text-cyan-300" />
                      Workspace
                    </span>
                      <span className="type-line inline-flex items-center gap-2 rounded-full border border-black/8 surface-accent px-3.5 py-2 pr-5 text-[10px] font-medium uppercase tracking-[0.34em] text-[var(--muted-strong)]">
                      Programmer mode live
                    </span>
                    <select
                      value={selectedLanguage}
                      onChange={(event) => setSelectedLanguage(event.target.value)}
                      className="control-chip rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[13px] font-medium text-[var(--foreground)] outline-none"
                    >
                      {problem.supportedLanguages.map((language) => (
                        <option key={language} value={language} className="bg-slate-950">
                          {languageLabels[language]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setWordWrap((current) => (current === "off" ? "on" : "off"))}
                      className="control-chip inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[13px] font-medium text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                    >
                      <WrapText className="h-4 w-4" />
                      Wrap {wordWrap === "off" ? "Off" : "On"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize((current) => Math.min(current + 1, 20))}
                      className="control-chip rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[13px] font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize((current) => Math.max(current - 1, 12))}
                      className="control-chip rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[13px] font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                    >
                      A-
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !interviewMode;
                        setInterviewMode(next);
                        if (!next) {
                          setInterviewStartedAt(null);
                          setElapsedSeconds(0);
                        } else {
                          resetInterviewMode();
                        }
                      }}
                      className={`control-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium ${
                        interviewMode
                          ? "border border-emerald-300/20 bg-[linear-gradient(135deg,#153726,#1e5b41)] text-[#f6f4ee]"
                          : "border border-black/10 bg-white/80 text-[var(--muted-strong)]"
                      }`}
                    >
                      <Clock3 className="h-4 w-4" />
                      {interviewMode ? "Interview Mode On" : "Interview Mode"}
                    </button>
                    {interviewMode ? (
                      <button
                        type="button"
                        onClick={resetInterviewMode}
                        className="control-chip inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[13px] font-medium text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                      >
                        <TimerReset className="h-4 w-4" />
                        Reset timer
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-black/8 surface-accent p-4 soft-float shadow-[0_16px_40px_rgba(17,18,20,0.08)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Session</p>
                    <p className="mt-2 text-[15px] font-semibold text-[var(--foreground)]">
                      {interviewMode
                        ? `${Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}:${(elapsedSeconds % 60).toString().padStart(2, "0")}`
                        : "Open practice"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/8 surface-accent p-4 shadow-[0_16px_40px_rgba(17,18,20,0.08)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Status</p>
                    <p className="mt-2 flex items-center gap-3 text-[15px] font-semibold text-[var(--foreground)]">
                      <span className="status-beacon inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      {saved ? "Auto-saved" : "Saving..."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/8 surface-accent p-4 shadow-[0_16px_40px_rgba(17,18,20,0.08)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Goal</p>
                    <p className="mt-2 text-[15px] font-semibold text-[var(--foreground)]">Hints, not answers</p>
                  </div>
                </div>
              </div>

              <div className="terminal-panel h-[60vh] min-h-[500px] overflow-hidden border-b border-white/8 bg-[#071120] xl:h-[68vh]">
                <CodeEditor
                  code={code}
                  language={selectedLanguage}
                  onChange={updateCode}
                  height="100%"
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                  fontSize={fontSize}
                  wordWrap={wordWrap}
                />
              </div>

              <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(5,10,22,0.96),rgba(2,6,23,0.98))] px-4 py-4 sm:px-5">
                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleRun()}
                      disabled={running}
                      className="neon-button neon-button-secondary inline-flex min-h-10 flex-1 items-center justify-between rounded-[18px] bg-[linear-gradient(135deg,#153726,#1f6b46)] px-4 py-2.5 text-left text-emerald-50 transition disabled:opacity-60"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-black/20">
                          <Play className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{running ? "Running tests..." : "Run"}</span>
                          <span className="block text-[11px] text-emerald-100/75">Quick output • Ctrl/Cmd + Enter</span>
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSubmit()}
                      disabled={submitting}
                      className="neon-button inline-flex min-h-10 flex-1 items-center justify-between rounded-[18px] bg-gradient-to-r from-cyan-400 via-emerald-300 to-amber-300 px-4 py-2.5 text-left text-slate-950 transition disabled:opacity-60"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/30">
                          <Send className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{submitting ? "Submitting..." : "Submit"}</span>
                          <span className="block text-[11px] text-slate-900/70">Full judge • Ctrl/Cmd + Shift + Enter</span>
                        </span>
                      </span>
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-cyan-300/12 bg-cyan-300/[0.05] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">Realtime solving hints</p>
                      <span className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-100">
                        Live workspace
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5">Auto-save notes</span>
                      <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5">AI coach popup</span>
                      <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5">Keyboard shortcuts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 tilt-3d neon-glow-pink">
                    <p className="text-sm font-semibold text-white">Focus prompts</p>
                    <div className="mt-3 space-y-2">
                      {checkpoints.slice(0, 3).map((item) => (
                        <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-950/50 p-3 text-sm text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 tilt-3d bg-accent-cyan neon-glow-cyan">
                    <p className="text-sm font-semibold text-white">Programmer mode tips</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-300">
                      <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-3">Keep your first pass simple, then optimize the repeated expensive step.</div>
                      <div className="rounded-2xl border border-white/8 bg-slate-950/50 p-3">Use the coach for a hint when blocked instead of asking for the final code.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-[#071120] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">Run + submit output</p>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Realtime</span>
                  </div>
                  <pre className="mt-4 min-h-[220px] whitespace-pre-wrap rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">
                    {output || "Your results panel will appear here after you run or submit the solution."}
                  </pre>
                </div>
              </div>
              </div>
            </div>
          </section>

          <section className={`${mobileSection !== "notes" ? "hidden xl:block" : ""} xl:col-span-2`}>
            <div className="rounded-[30px] border border-white/10 bg-slate-950/75 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FileCode2 className="h-4 w-4 text-cyan-300" />
                    Idea Pad
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Capture your invariant, candidate data structure, brute-force baseline, or failing cases. These notes are saved per problem on this device.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Write your plan here before coding..."
                    className="mt-4 h-64 w-full resize-none rounded-[22px] border border-white/8 bg-slate-950/65 p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Bot className="h-4 w-4 text-emerald-300" />
                      Smart Coach included
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      The floating coach button already knows the active question and can help with:
                    </p>
                    <div className="mt-4 grid gap-3">
                      {[
                        "First-step hints when you are blocked",
                        "Logic walkthroughs that explain why an approach works",
                        "Edge-case prompts before you submit"
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/8 bg-slate-950/50 p-4 text-sm text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Target className="h-4 w-4 text-amber-300" />
                      Submission checklist
                    </p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Did you test one normal case and one awkward edge case?",
                        "Is the time complexity intentional, not accidental?",
                        "Would your variable names make sense in an interview?"
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/8 bg-slate-950/50 p-4 text-sm text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ProblemCoach
        problemId={problem.id}
        problemTitle={problem.title}
        problemDifficulty={problem.difficulty}
      />
    </ProtectedShell>
  );
}

export default function SolvePage() {
  return (
    <Suspense
      fallback={
        <ProtectedShell title="Solve" subtitle="Preparing your workspace." showHero={false}>
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="h-[70vh] animate-pulse rounded-[30px] border border-black/8 bg-white/70" />
            <div className="h-[70vh] animate-pulse rounded-[30px] border border-black/8 bg-white/70" />
          </div>
        </ProtectedShell>
      }
    >
      <SolvePageContent />
    </Suspense>
  );
}

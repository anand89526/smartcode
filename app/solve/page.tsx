"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Heart,
  MessageSquare,
  Play,
  Send,
  Share2,
  Star,
  Tag,
  Terminal,
  Users,
  X,
} from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
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
  python: 'def solution(nums):\n  return []',
  c: '#include <stdio.h>\nvoid solution(int* nums) {}',
  cpp: '#include <vector>\nvector<int> solution(vector<int>& nums) { return {}; }',
};

const diffBadgeClass: Record<string, string> = {
  Easy: "diff-badge-easy",
  Medium: "diff-badge-medium",
  Hard: "diff-badge-hard",
};

export default function Solve() {
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [relatedProblems, setRelatedProblems] = useState<RelatedProblem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"description" | "editorial" | "solutions" | "submissions">("description");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
  const [user, setUser] = useState<SessionUser | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bottomTab, setBottomTab] = useState<"testcase" | "result">("testcase");
  const [splitPercent, setSplitPercent] = useState(42);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(true);
  const [submissionPopup, setSubmissionPopup] = useState<{
    open: boolean;
    title: string;
    body: string;
    tone: "success" | "warning" | "danger";
  }>({ open: false, title: "", body: "", tone: "success" });

  useEffect(() => {
    const session = getUserSession();
    const problemId = searchParams.get("problemId");
    if (!session?.id || !problemId) { setLoading(false); return; }
    setUser(session);
    async function loadProblem() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/problems/${problemId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        const supportedLangs = ["javascript", "typescript", "java", "python", "c", "cpp"];
        const langs = data.problem.supportedLanguages?.filter((l: string) => supportedLangs.includes(l)) || ["javascript"];
        const allLangs = [...new Set([...langs, ...supportedLangs])].slice(0, 6);
        setProblem({ ...data.problem, supportedLanguages: allLangs });
        setRelatedProblems(data.relatedProblems || []);
        setSelectedLanguage(langs[0]);
        const codeMap: Record<string, string> = {};
        allLangs.forEach((lang: string) => {
          codeMap[lang] = data.problem.starterCode?.[lang] || starterCodes[lang] || "";
        });
        setCodeByLanguage(codeMap);
      } catch (error) {
        console.error(error);
        setOutput("Unable to load problem.");
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [searchParams]);

  const code = useMemo(() => codeByLanguage[selectedLanguage] || "", [codeByLanguage, selectedLanguage]);

  const updateCode = (value: string) => {
    setSaved(false);
    setCodeByLanguage((prev) => ({ ...prev, [selectedLanguage]: value }));
    setTimeout(() => setSaved(true), 800);
  };

  const formatJudgeResult = (result: JudgeResponse) => {
    if (result.status === "accepted") return `✓ Accepted\nPassed ${result.passed}/${result.total} tests.`;
    if (result.status === "wrong_answer") return `✗ Wrong Answer\nExpected: ${JSON.stringify(result.expected)}\nActual: ${JSON.stringify(result.actual)}`;
    if (result.status === "compile_error") return `✗ Compile Error\n${result.error}`;
    return `✗ Runtime Error\n${result.error}`;
  };

  const showPopup = (title: string, body: string, tone: "success" | "warning" | "danger") => {
    setSubmissionPopup({ open: true, title, body, tone });
    setTimeout(() => setSubmissionPopup((p) => ({ ...p, open: false })), 3000);
  };

  const handleRun = useCallback(async () => {
    if (!problem) return;
    setRunning(true);
    setBottomTab("result");
    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problem.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });
      const data = await response.json();
      setOutput(formatJudgeResult(data.result));
    } catch {
      setOutput("Run failed. Check backend server.");
    } finally {
      setRunning(false);
    }
  }, [problem, code, selectedLanguage]);

  const handleSubmit = useCallback(async () => {
    const session = getUserSession();
    if (!problem || !session?.id) return;
    setSubmitting(true);
    setBottomTab("result");
    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problem.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id, code, language: selectedLanguage }),
      });
      const data = await response.json();
      const nextUser = buildUserProfile(data.user);
      saveUserSession(nextUser);
      setUser(nextUser);
      setOutput(formatJudgeResult(data.result));
      if (data.result.status === "accepted") {
        showPopup("Success", `Accepted! +${Math.max(nextUser.points - (user?.points ?? 0), 0)} points`, "success");
      } else {
        showPopup("Submitted", "Solution recorded.", data.result.status === "wrong_answer" ? "warning" : "danger");
      }
    } catch {
      setOutput("Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }, [problem, code, selectedLanguage, user]);

  // Drag-to-resize
  const handleMouseDown = () => setIsDragging(true);
  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPercent(Math.min(Math.max(pct, 25), 70));
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const leftTabs = [
    { id: "description" as const, icon: FileText, label: "Description" },
    { id: "editorial" as const, icon: BookOpenText, label: "Editorial" },
    { id: "solutions" as const, icon: Code2, label: "Solutions" },
    { id: "submissions" as const, icon: Terminal, label: "Submissions" },
  ];

  return (
    <ProtectedShell title="Solve" subtitle="Code in real-time." showHero={false}>
      {/* Submission popup */}
      <AnimatePresence>
        {submissionPopup.open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed right-6 top-20 z-50 w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                submissionPopup.tone === "success" ? "bg-emerald-400/15 text-emerald-400" :
                submissionPopup.tone === "warning" ? "bg-amber-400/15 text-amber-400" :
                "bg-rose-400/15 text-rose-400"
              }`}>
                {submissionPopup.tone === "success" ? <Check className="h-5 w-5" /> :
                 submissionPopup.tone === "warning" ? "!" : <X className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold text-white">{submissionPopup.title}</p>
                <p className="text-sm text-slate-300">{submissionPopup.body}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          <div className="shimmer-loading h-12 rounded-xl" />
          <div className="flex gap-3 h-[80vh]">
            <div className="shimmer-loading flex-1 rounded-xl" />
            <div className="shimmer-loading flex-1 rounded-xl" />
          </div>
        </div>
      ) : !problem ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-300">
          Select a problem to start.
        </div>
      ) : (
        <div className="space-y-0">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="solve-topbar rounded-t-2xl"
          >
            <div className="flex items-center gap-3">
              <Link href="/problems" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition">
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <span className="text-sm font-medium text-white">{problem.title}</span>
              <span className={`${diffBadgeClass[problem.difficulty]} text-[11px]`}>{problem.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleRun}
                disabled={running}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glow-btn flex items-center gap-2 rounded-lg bg-[#1e3a1e] px-4 py-1.5 text-sm font-medium text-emerald-300 border border-emerald-500/20 transition hover:bg-[#254025] disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                {running ? "Running..." : "Run"}
                <span className="kbd ml-1">⌘↵</span>
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glow-btn flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {submitting ? "Submitting..." : "Submit"}
                <span className="kbd ml-1 border-emerald-400/30 bg-emerald-400/10 text-emerald-200">⌘⇧↵</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Main split layout */}
          <div
            ref={containerRef}
            className="flex overflow-hidden rounded-b-2xl border border-white/6 border-t-0"
            style={{ height: "calc(100vh - 160px)", userSelect: isDragging ? "none" : "auto" }}
          >
            {/* Left Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="solve-panel flex flex-col"
              style={{ width: `${splitPercent}%` }}
            >
              {/* Tabs */}
              <div className="solve-panel-header flex-shrink-0">
                {leftTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`solve-panel-tab flex items-center gap-1.5 ${activeTab === tab.id ? "active" : ""}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="solve-scroll flex-1 overflow-y-auto px-6 py-5">
                {activeTab === "description" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={diffBadgeClass[problem.difficulty]}>{problem.difficulty}</span>
                      {problem.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400">
                          <Tag className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 text-sm leading-7 text-slate-200">{problem.description}</div>

                    {/* Examples */}
                    {problem.examples?.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {problem.examples.map((ex, i) => (
                          <div key={i} className="example-block">
                            <p className="mb-2 text-sm font-semibold text-white">Example {i + 1}:</p>
                            <div className="space-y-1 font-mono text-sm">
                              <p><span className="text-slate-500">Input:</span> <span className="text-cyan-200">{ex.input}</span></p>
                              <p><span className="text-slate-500">Output:</span> <span className="text-emerald-200">{ex.output}</span></p>
                              {ex.explanation && (
                                <p className="mt-2 text-slate-400"><span className="text-slate-500">Explanation:</span> {ex.explanation}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Constraints */}
                    <div className="mt-6">
                      <p className="mb-2 text-sm font-semibold text-white">Points</p>
                      <p className="text-sm text-amber-200">{problem.points} pts</p>
                    </div>

                    {/* Bottom stats bar */}
                    <div className="mt-8 flex items-center gap-4 border-t border-white/6 pt-4">
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
                        <Heart className="h-3.5 w-3.5" /> Like
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
                        <MessageSquare className="h-3.5 w-3.5" /> Discuss
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
                        <Star className="h-3.5 w-3.5" /> Save
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </button>
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                        <Users className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="pulse-live inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "editorial" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Approach / Pseudocode</h2>
                    <pre className="rounded-xl bg-[#0d1117] border border-white/6 p-4 text-sm text-slate-300 overflow-x-auto font-mono leading-6">
                      {problem.pseudocode || "No editorial available yet."}
                    </pre>
                  </motion.div>
                )}

                {activeTab === "solutions" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400">
                    <p>Community solutions will appear here after you solve the problem.</p>
                  </motion.div>
                )}

                {activeTab === "submissions" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {output ? (
                      <pre className="rounded-xl bg-[#0d1117] border border-white/6 p-4 text-sm text-slate-200 overflow-x-auto whitespace-pre-wrap font-mono">
                        {output}
                      </pre>
                    ) : (
                      <p className="text-sm text-slate-400">No submissions yet.</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Resize Handle */}
            <div
              className={`resize-handle ${isDragging ? "active" : ""}`}
              onMouseDown={handleMouseDown}
            />

            {/* Right Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              {/* Code header */}
              <div className="solve-panel-header justify-between flex-shrink-0 bg-[#0d1117]">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Code</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white outline-none cursor-pointer"
                  >
                    {problem.supportedLanguages.map((l) => (
                      <option key={l} value={l} className="bg-slate-900">{languageLabels[l]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden bg-[#0d1117]">
                <CodeEditor
                  code={code}
                  language={selectedLanguage}
                  onChange={updateCode}
                  height="100%"
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                />
              </div>

              {/* Saved status */}
              <div className="flex items-center justify-between border-t border-white/6 bg-[#0d1117] px-4 py-1.5 text-xs text-slate-500">
                <span>{saved ? "Saved" : "Saving..."}</span>
                <div className="flex items-center gap-3">
                  <span>Rank #{user?.rank ?? "-"}</span>
                  <span>•</span>
                  <span>{user?.points ?? 0} pts</span>
                </div>
              </div>

              {/* Bottom testcase/result panel */}
              <div className="testcase-panel flex flex-col" style={{ height: "180px" }}>
                <div className="flex items-center gap-1 border-b border-white/6 px-4 py-2">
                  <button
                    onClick={() => setBottomTab("testcase")}
                    className={`testcase-tab ${bottomTab === "testcase" ? "active" : ""}`}
                  >
                    Testcase
                  </button>
                  <button
                    onClick={() => setBottomTab("result")}
                    className={`testcase-tab flex items-center gap-1.5 ${bottomTab === "result" ? "active" : ""}`}
                  >
                    <Terminal className="h-3 w-3" />
                    Test Result
                  </button>
                </div>
                <div className="solve-scroll flex-1 overflow-y-auto px-4 py-3">
                  {bottomTab === "testcase" && (
                    <div className="space-y-2">
                      {problem.examples?.length > 0 ? (
                        problem.examples.slice(0, 2).map((ex, i) => (
                          <div key={i} className="rounded-lg bg-[#0d1117] border border-white/6 px-3 py-2 font-mono text-xs text-slate-300">
                            <span className="text-slate-500">Case {i + 1}: </span>{ex.input}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No test cases available.</p>
                      )}
                    </div>
                  )}
                  {bottomTab === "result" && (
                    <div>
                      {output ? (
                        <pre className={`text-xs font-mono whitespace-pre-wrap ${
                          output.startsWith("✓") ? "text-emerald-300" : output.startsWith("✗") ? "text-rose-300" : "text-slate-300"
                        }`}>
                          {output}
                        </pre>
                      ) : (
                        <p className="text-xs text-slate-500">You must run your code first.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </ProtectedShell>
  );
}

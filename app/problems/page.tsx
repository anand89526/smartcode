"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Compass,
  Flame,
  GraduationCap,
  Search,
  Shuffle,
  Sparkles,
  Star,
  Swords,
  Target,
  TrendingUp,
} from "lucide-react";
import ProtectedShell from "@/components/ProtectedShell";
import { apiBaseUrl } from "@/lib/api";
import { getUserSession } from "@/lib/session";

type ProblemListItem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptanceRate: number;
  solved: boolean;
  isFavorite?: boolean;
  points?: number;
};

type StudyPlan = {
  _id?: string;
  title: string;
  description: string;
  color?: string;
  problems?: Array<{ id?: string; _id?: string }>;
};

type ProblemResponse = {
  problems: ProblemListItem[];
  totalCount: number;
  topicTags?: { name: string; count: number }[];
  companies?: { name: string; count: number }[];
  activityCalendar?: number[];
  weeklyStreak?: boolean[];
  trendingToday?: ProblemListItem[];
  topTen?: ProblemListItem[];
};

const lanes = [
  {
    id: "warmup",
    title: "Warm-up lane",
    description: "Quick wins to build rhythm before deep work.",
    filter: (problem: ProblemListItem) => problem.difficulty === "Easy",
  },
  {
    id: "interview",
    title: "Interview lane",
    description: "Balanced problems with strong pattern repetition.",
    filter: (problem: ProblemListItem) => problem.difficulty !== "Hard",
  },
  {
    id: "stretch",
    title: "Stretch lane",
    description: "Harder prompts when you want deliberate challenge.",
    filter: (problem: ProblemListItem) => problem.difficulty === "Hard",
  },
];

const difficultyStyles: Record<ProblemListItem["difficulty"], string> = {
  Easy: "text-emerald-800 bg-emerald-100 ring-1 ring-emerald-200 font-semibold",
  Medium: "text-amber-800 bg-amber-100 ring-1 ring-amber-200 font-semibold",
  Hard: "text-rose-800 bg-rose-100 ring-1 ring-rose-200 font-semibold",
};

export default function ProblemsPage() {
  const [data, setData] = useState<ProblemResponse | null>(null);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "favorites">("all");

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/problems/study-plans`)
      .then((response) => response.json())
      .then((payload) => setStudyPlans(payload.studyPlans || []))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const session = getUserSession();

    if (!session?.id) {
      return;
    }

    fetch(`${apiBaseUrl}/api/problems?userId=${session.id}`)
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .catch((error) => console.error(error));
  }, []);

  const filteredProblems = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.problems.filter((problem) => {
      const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;
      const matchesTag = !activeTag || problem.tags.includes(activeTag);
      const matchesView = view === "all" || problem.isFavorite;

      return matchesSearch && matchesDifficulty && matchesTag && matchesView;
    });
  }, [activeTag, data, difficulty, search, view]);

  const solvedCount = useMemo(
    () => data?.problems.filter((problem) => problem.solved).length || 0,
    [data]
  );
  const recommendedProblem = useMemo(() => {
    return filteredProblems.find((problem) => !problem.solved) || filteredProblems[0] || null;
  }, [filteredProblems]);
  const featuredLaneProblems = useMemo(() => {
    return lanes.map((lane) => ({
      ...lane,
      problem:
        data?.problems.find((problem) => lane.filter(problem) && !problem.solved) ||
        data?.problems.find(lane.filter) ||
        null,
    }));
  }, [data]);

  async function toggleFavorite(problemId: string) {
    const session = getUserSession();

    if (!session?.id || !data) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problemId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to update favorite");
      }

      setData({
        ...data,
        problems: data.problems.map((problem) =>
          problem.id === problemId ? { ...problem, isFavorite: payload.isFavorite } : problem
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ProtectedShell
      title="Problem Library"
      subtitle="Discover challenges through learning lanes, plans, and a cleaner, faster problem workflow."
      showHero={false}
      fullWidth
    >
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-12 pt-4 sm:px-5 lg:px-7">
        <section className="mb-5 rounded-[32px] border border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(121,242,221,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(246,179,215,0.12),transparent_25%),rgba(255,255,255,0.84)] p-5 shadow-[0_30px_90px_rgba(23,23,25,0.1)] sm:p-7">
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Learning system
              </p>
              <h1 className="mt-3 font-mono text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
                A problem page built for momentum, not just scrolling.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted-strong)]">
                Build sessions from curated lanes, jump into a recommended next problem, or
                follow a study plan. The goal here is to make discovery feel intentional instead
                of list-heavy.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    view === "all"
                      ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                      : "border border-black/12 bg-white/80 text-[var(--muted-strong)] font-medium hover:bg-white hover:shadow-sm"
                  }`}
                >
                  All problems
                </button>
                <button
                  type="button"
                  onClick={() => setView("favorites")}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    view === "favorites"
                      ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                      : "border border-black/12 bg-white/80 text-[var(--muted-strong)] font-medium hover:bg-white hover:shadow-sm"
                  }`}
                >
                  Favorites only
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/8 bg-white/74 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Solved</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{solvedCount}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Completed challenges</p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/74 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Library</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  {data?.totalCount || 0}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Available problems</p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/74 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Plans</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                  {studyPlans.length}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Learning tracks</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr_0.8fr]">
          <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Sparkles className="h-4 w-4 text-[var(--foreground)]" />
              Recommended next solve
            </p>
            {recommendedProblem ? (
              <>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                  {recommendedProblem.title}
                </h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${difficultyStyles[recommendedProblem.difficulty]}`}
                  >
                    {recommendedProblem.difficulty}
                  </span>
                  <span>{recommendedProblem.acceptanceRate}% acceptance</span>
                  <span>{recommendedProblem.tags.slice(0, 2).join(" • ")}</span>
                </div>
                <Link
                  href={`/solve?problemId=${recommendedProblem.id}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#171719] px-4 py-2 text-sm font-semibold text-[#f6f4ee]"
                >
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">Loading your best next match...</p>
            )}
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Search className="h-4 w-4 text-[var(--foreground)]" />
                  Filter the library
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Search fast, then narrow by difficulty and topic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const pool = filteredProblems.length > 0 ? filteredProblems : data?.problems || [];
                  const random = pool[Math.floor(Math.random() * pool.length)];
                  if (random) {
                    window.location.href = `/solve?problemId=${random.id}`;
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white/90 px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-white hover:shadow-md"
              >
                <Shuffle className="h-4 w-4" />
                Surprise me
              </button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
                <Search className="h-4 w-4 text-[var(--muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title..."
                  className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(["All", "Easy", "Medium", "Hard"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDifficulty(item)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      difficulty === item
                        ? "bg-[#111214] text-[#f6f4ee] shadow-sm"
                        : "border border-black/12 bg-white/90 text-[var(--muted-strong)] hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(data?.topicTags || []).slice(0, 10).map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setActiveTag((current) => (current === tag.name ? null : tag.name))}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                    activeTag === tag.name
                      ? "bg-[#111214] text-[#f6f4ee] ring-1 ring-black/10 shadow-sm"
                      : "border border-black/12 bg-white/90 text-[var(--muted-strong)] hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {tag.name} · {tag.count}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Flame className="h-4 w-4 text-[var(--foreground)]" />
              Today&apos;s pulse
            </p>
            <div className="mt-4 space-y-3">
              {(data?.trendingToday || []).slice(0, 3).map((problem) => (
                <Link
                  key={problem.id}
                  href={`/solve?problemId=${problem.id}`}
                  className="block rounded-2xl border border-black/8 bg-[var(--page-bg)] p-4 transition hover:bg-white"
                >
                  <p className="text-sm font-medium text-[var(--foreground)]">{problem.title}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span className={`rounded-full px-2.5 py-1 ${difficultyStyles[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span>{problem.acceptanceRate}% acceptance</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <Target className="h-4 w-4 text-[var(--foreground)]" />
              Learning lanes
            </p>
            <p className="text-sm text-[var(--muted)]">Three ways to start based on your energy.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredLaneProblems.map((lane) => (
              <div
                key={lane.id}
                className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{lane.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{lane.description}</p>
                {lane.problem ? (
                  <Link
                    href={`/solve?problemId=${lane.problem.id}`}
                    className="mt-4 block rounded-[22px] border border-black/8 bg-[var(--page-bg)] p-4 transition hover:bg-white"
                  >
                    <p className="text-base font-medium text-[var(--foreground)]">
                      {lane.problem.title}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                      <span className={`rounded-full px-2.5 py-1 ${difficultyStyles[lane.problem.difficulty]}`}>
                        {lane.problem.difficulty}
                      </span>
                      <span>{lane.problem.acceptanceRate}% acceptance</span>
                    </div>
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    No matching problem available yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5 grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Compass className="h-4 w-4 text-[var(--foreground)]" />
                  Problem board
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {filteredProblems.length} visible problems in your current view.
                </p>
              </div>
              <div className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm text-[var(--foreground)]">
                {solvedCount}/{data?.totalCount || 0} solved
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {filteredProblems.map((problem, index) => (
                <Link
                  key={problem.id}
                  href={`/solve?problemId=${problem.id}`}
                  className="block rounded-[24px] border border-black/8 bg-[var(--page-bg)] p-4 transition hover:bg-white"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-white text-sm font-semibold text-[var(--muted)]">
                        {problem.solved ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <p className="text-base font-medium text-[var(--foreground)]">
                          {problem.title}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-xs text-[var(--muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs ${difficultyStyles[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm text-[var(--muted)]">
                        {problem.acceptanceRate}% acceptance
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          void toggleFavorite(problem.id);
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--muted)] transition hover:border-black/18 hover:text-amber-500"
                        aria-label="Toggle favorite"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            problem.isFavorite ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredProblems.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-black/10 bg-white/55 p-8 text-center text-sm text-[var(--muted)]">
                  No problems match the current filters.
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <GraduationCap className="h-4 w-4 text-[var(--foreground)]" />
                Study plans
              </p>
              <div className="mt-4 space-y-3">
                {studyPlans.slice(0, 4).map((plan) => (
                  <div
                    key={plan._id || plan.title}
                    className="rounded-[22px] border border-black/8 bg-[var(--page-bg)] p-4"
                  >
                    <p className="text-base font-medium text-[var(--foreground)]">{plan.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {plan.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>{plan.problems?.length || 0} problems</span>
                      <span className="inline-flex items-center gap-1 text-[var(--foreground)]">
                        Start planning
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/8 bg-white/78 p-5 backdrop-blur-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <TrendingUp className="h-4 w-4 text-[var(--foreground)]" />
                Platform signals
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Top tags
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {(data?.topicTags || []).slice(0, 3).map((tag) => tag.name).join(", ") ||
                      "Loading..."}
                  </p>
                </div>
                <div className="rounded-2xl border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Trending companies
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {(data?.companies || []).slice(0, 3).map((company) => company.name).join(", ") ||
                      "Loading..."}
                  </p>
                </div>
                <div className="rounded-2xl border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    <Bookmark className="h-3.5 w-3.5" />
                    Favorites
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {data?.problems.filter((problem) => problem.isFavorite).length || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-black/8 bg-[var(--page-bg)] p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    <Swords className="h-3.5 w-3.5" />
                    Hard set
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {data?.problems.filter((problem) => problem.difficulty === "Hard").length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedShell>
  );
}

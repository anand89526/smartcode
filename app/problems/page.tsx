"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Database,
  Filter,
  FolderHeart,
  GraduationCap,
  Heart,
  Library,
  Lock,
  Plus,
  Search,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Star,
  Swords,
  Terminal,
  Trophy,
  Zap,
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
};

type ProblemResponse = {
  problems: ProblemListItem[];
  totalCount: number;
};

const topicTags = [
  { name: "Array", count: 1584 },
  { name: "String", count: 721 },
  { name: "Hash Table", count: 612 },
  { name: "Math", count: 528 },
  { name: "Dynamic Programming", count: 502 },
  { name: "Sorting", count: 412 },
  { name: "Greedy", count: 380 },
  { name: "Depth-First Search", count: 298 },
  { name: "Binary Search", count: 264 },
  { name: "Tree", count: 241 },
];

const categories = [
  { id: "all", label: "All Topics", icon: Sparkles },
  { id: "algo", label: "Algorithms", icon: Code2 },
  { id: "db", label: "Database", icon: Database },
  { id: "shell", label: "Shell", icon: Terminal },
  { id: "js", label: "JavaScript", icon: Zap },
];

const companies = [
  { name: "Google", count: 2261 },
  { name: "Amazon", count: 1960 },
  { name: "Meta", count: 1383 },
  { name: "Microsoft", count: 1142 },
  { name: "Apple", count: 862 },
  { name: "Uber", count: 362 },
];

const banners = [
  {
    title: "SmartCode at Your Fingertips",
    sub: "Practice anytime, anywhere",
    bg: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1a4a6e 100%)",
  },
  {
    title: "30 Days Challenge",
    sub: "Beginner Friendly",
    bg: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)",
  },
  {
    title: "Top Interview Questions",
    sub: "Most frequently asked",
    bg: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #2563eb 100%)",
  },
  {
    title: "Weekly Contest",
    sub: "Compete & climb ranks",
    bg: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6d28d9 100%)",
  },
];

export default function Problems() {
  const [data, setData] = useState<ProblemResponse | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeCat, setActiveCat] = useState("all");
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const session = getUserSession();
    if (!session?.id) return;
    fetch(`${apiBaseUrl}/api/problems?userId=${session.id}`)
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.problems.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || p.difficulty === filter;
      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  const solvedCount = useMemo(
    () => data?.problems.filter((p) => p.solved).length || 0,
    [data]
  );

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const calDays: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const rowVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  return (
    <ProtectedShell title="Problem Library" subtitle="Sharpen your skills." showHero={false}>
      {/* Floating particles */}
      <div className="lc-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="lc-particle"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="lc-page">
        {/* ═══════ LEFT SIDEBAR ═══════ */}
        <aside className="lc-sidebar">
          <motion.button
            whileHover={{ x: 3 }}
            className="lc-sidebar-link active"
          >
            <Library size={18} /> Library
          </motion.button>
          <motion.button whileHover={{ x: 3 }} className="lc-sidebar-link">
            <Swords size={18} /> Quest
            <span className="lc-sidebar-badge">New</span>
          </motion.button>
          <motion.button whileHover={{ x: 3 }} className="lc-sidebar-link">
            <Compass size={18} /> Explore
          </motion.button>
          <motion.button whileHover={{ x: 3 }} className="lc-sidebar-link">
            <GraduationCap size={18} /> Study Plan
          </motion.button>

          <div className="lc-sidebar-divider" />

          <div className="lc-sidebar-section">
            <span>My Lists</span>
            <button style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
              <Plus size={14} />
            </button>
          </div>
          <motion.button whileHover={{ x: 3 }} className="lc-sidebar-link">
            <FolderHeart size={18} /> Favorite
            <Lock size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </motion.button>

          <div className="lc-sidebar-divider" />

          {/* Stats card */}
          <div
            style={{
              marginTop: "auto",
              padding: "16px",
              background: "rgba(255,161,22,0.06)",
              borderRadius: "12px",
              border: "1px solid rgba(255,161,22,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Trophy size={16} style={{ color: "#ffa116" }} />
              <span style={{ fontSize: 13, color: "#ffa116", fontWeight: 600 }}>Progress</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{solvedCount}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Problems Solved</div>
          </div>
        </aside>

        {/* ═══════ MAIN CONTENT ═══════ */}
        <main className="lc-main solve-scroll">
          {/* Banner Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lc-banners"
          >
            {banners.map((b, i) => (
              <motion.div
                key={i}
                className="lc-banner-card"
                style={{ background: b.bg }}
                whileHover={{ scale: 1.03, y: -4 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <h3>{b.title}</h3>
                <p>{b.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Topic Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lc-tags-bar"
          >
            {(showAllTags ? topicTags : topicTags.slice(0, 7)).map((tag) => (
              <motion.button
                key={tag.name}
                className="lc-topic-tag"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {tag.name}
                <span className="count">{tag.count}</span>
              </motion.button>
            ))}
            <button
              className="lc-expand-btn"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? "Collapse" : "Expand ›"}
            </button>
          </motion.div>

          {/* Category Tabs */}
          <div className="lc-category-tabs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  className={`lc-cat-tab ${activeCat === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCat(cat.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={15} className="icon" />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="lc-search-bar">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="lc-search-input">
                <Search size={15} style={{ color: "#64748b", flexShrink: 0 }} />
                <input
                  placeholder="Search questions"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="lc-icon-btn">
                <SlidersHorizontal size={15} />
              </button>
              <button className="lc-icon-btn">
                <Filter size={15} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="lc-solved-counter">
                <div className="ring" />
                <span>
                  {solvedCount}/{data?.totalCount || 0} Solved
                </span>
              </div>

              {/* Difficulty filter pills */}
              <div style={{ display: "flex", gap: 4 }}>
                {["All", "Easy", "Medium", "Hard"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      border: "1px solid",
                      borderColor:
                        filter === f
                          ? "rgba(255,161,22,0.4)"
                          : "rgba(255,255,255,0.08)",
                      background:
                        filter === f
                          ? "rgba(255,161,22,0.12)"
                          : "rgba(255,255,255,0.03)",
                      color:
                        filter === f
                          ? "#ffa116"
                          : "#94a3b8",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button className="lc-icon-btn" title="Pick random">
                <Shuffle size={15} />
              </button>
            </div>
          </div>

          {/* Daily Challenge (first problem) */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href={`/solve?problemId=${filtered[0].id}`} style={{ textDecoration: "none" }}>
                <div className="lc-daily-row">
                  <div className="status-icon">
                    <Star size={16} style={{ color: "#ffa116" }} />
                  </div>
                  <div className="title-col">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {filtered[0].title}
                    </span>
                  </div>
                  <span className="acceptance">{filtered[0].acceptanceRate}%</span>
                  <span
                    className={`diff ${filtered[0].difficulty.toLowerCase()}`}
                  >
                    {filtered[0].difficulty === "Medium"
                      ? "Med."
                      : filtered[0].difficulty}
                  </span>
                  <Lock size={14} style={{ color: "#64748b", opacity: 0.4 }} />
                </div>
              </Link>
            </motion.div>
          )}

          {/* Problem List */}
          <div className="lc-problem-list">
            <AnimatePresence>
              {filtered.slice(1).map((p, i) => (
                <motion.div
                  key={p.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <Link href={`/solve?problemId=${p.id}`} style={{ textDecoration: "none" }}>
                    <div className="lc-problem-row">
                      <div className="status-icon">
                        {p.solved ? (
                          <Check size={16} style={{ color: "#00b8a3" }} />
                        ) : (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              border: "1.5px solid #475569",
                            }}
                          />
                        )}
                      </div>
                      <div className="title-col">
                        <span style={{ color: "#64748b", fontSize: 13, minWidth: 30 }}>
                          {i + 2}.
                        </span>
                        {p.title}
                      </div>
                      <span className="acceptance">{p.acceptanceRate}%</span>
                      <span className={`diff ${p.difficulty.toLowerCase()}`}>
                        {p.difficulty === "Medium" ? "Med." : p.difficulty}
                      </span>
                      <Lock size={14} style={{ color: "#64748b", opacity: 0.3 }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                No problems found
              </div>
            )}
          </div>
        </main>

        {/* ═══════ RIGHT SIDEBAR ═══════ */}
        <aside className="lc-right solve-scroll">
          {/* Calendar */}
          <motion.div
            className="lc-right-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="lc-calendar-header">
              <div>
                <span className="day-count" style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
                  Day {dayOfYear}
                </span>
                <span className="day-count" style={{ marginLeft: 6 }}>
                  {365 - dayOfYear} days left
                </span>
              </div>
              <div className="nav-arrows">
                <button><ChevronLeft size={16} /></button>
                <button><ChevronRight size={16} /></button>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
              {now.toLocaleString("default", { month: "long" })}
            </div>
            <div className="lc-cal-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`label-${i}`} className="lc-cal-day-label">{d}</div>
              ))}
              {calDays.map((d, i) => (
                <div
                  key={`day-${i}`}
                  className={`lc-cal-day ${d === now.getDate() ? "today" : ""}`}
                >
                  {d || ""}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Streak / Weekly */}
          <motion.div
            className="lc-right-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} style={{ color: "#ffa116" }} />
                Weekly Streak
              </h4>
              <span style={{ fontSize: 11, color: "#64748b" }}>
                {7 - now.getDay()} days left
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      i < now.getDay()
                        ? "linear-gradient(135deg, #ffa116, #ff6b00)"
                        : "rgba(255,255,255,0.04)",
                    color: i < now.getDay() ? "#fff" : "#64748b",
                    border: `1px solid ${
                      i < now.getDay()
                        ? "rgba(255,161,22,0.3)"
                        : "rgba(255,255,255,0.06)"
                    }`,
                    transition: "all 200ms ease",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trending Companies */}
          <motion.div
            className="lc-right-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ margin: 0 }}>Trending Companies</h4>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="lc-icon-btn" style={{ width: 26, height: 26 }}>
                  <ChevronLeft size={14} />
                </button>
                <button className="lc-icon-btn" style={{ width: 26, height: 26 }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div
              className="lc-search-input"
              style={{ marginBottom: 12, flex: "unset" }}
            >
              <Search size={14} style={{ color: "#64748b", flexShrink: 0 }} />
              <input placeholder="Search a company..." style={{ fontSize: 12 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {companies.map((c) => (
                <motion.div
                  key={c.name}
                  className="lc-company-pill"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {c.name}
                  <span className="cnt">{c.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="lc-right-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
            style={{
              background: "linear-gradient(135deg, rgba(255,161,22,0.06), rgba(255,107,0,0.04))",
              border: "1px solid rgba(255,161,22,0.12)",
            }}
          >
            <h4 style={{ margin: 0, color: "#ffa116", display: "flex", alignItems: "center", gap: 6 }}>
              <Heart size={16} /> Community
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                  {data?.totalCount || 0}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Problems</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#00b8a3" }}>
                  {solvedCount}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Solved</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#ffc01e" }}>
                  {Math.round(
                    data?.totalCount
                      ? (solvedCount / data.totalCount) * 100
                      : 0
                  )}
                  %
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Rate</div>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </ProtectedShell>
  );
}
"use client";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  headline: string;
  solvedProblems: number;
  rank: number;
  streak: number;
  battleWins: number;
  contests: number;
  points: number;
  level: string;
  country: string;
  bio: string;
  totalSubmissions: number;
  acceptedSubmissions: number;
  solvedProblemIds: string[];
  lastSolvedAt?: string | null;
  lastActiveAt?: string | null;
  createdAt?: string | null;
};

const STORAGE_KEY = "smartcode-user";

export function buildUserProfile(user: Partial<SessionUser> & { email: string; id?: string; _id?: string }): SessionUser {
  return {
    id: user.id || user._id || "",
    name: user.name || "SmartCode User",
    email: user.email,
    avatarUrl: user.avatarUrl ?? "",
    headline: user.headline ?? "Competitive programmer leveling up every day.",
    solvedProblems: user.solvedProblems ?? 0,
    rank: user.rank ?? 0,
    streak: user.streak ?? 0,
    battleWins: user.battleWins ?? 0,
    contests: user.contests ?? 0,
    points: user.points ?? 0,
    level: user.level ?? "Rising Coder",
    country: user.country ?? "India",
    bio: user.bio ?? "Building consistency one problem at a time.",
    totalSubmissions: user.totalSubmissions ?? 0,
    acceptedSubmissions: user.acceptedSubmissions ?? 0,
    solvedProblemIds: user.solvedProblemIds ?? [],
    lastSolvedAt: user.lastSolvedAt ?? null,
    lastActiveAt: user.lastActiveAt ?? null,
    createdAt: user.createdAt ?? null,
  };
}

export function saveUserSession(user: SessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getUserSession(): SessionUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return buildUserProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearUserSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

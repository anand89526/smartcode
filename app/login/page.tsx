"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, TerminalSquare } from "lucide-react";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, saveUserSession } from "@/lib/session";

const accessChecks = [
  "Full dashboard and coding environment access",
  "Real-time battles and leaderboard rankings",
  "Your profile and progress tracking",
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Unable to login");

      if (res.ok && data.message === "Login successful") {
        saveUserSession(buildUserProfile(data.user));
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Login request failed. Make sure the backend and MongoDB are running on localhost:5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4 py-10 text-[var(--foreground)]">
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="orb left-[8%] top-24 h-56 w-56 bg-[rgba(121,242,221,0.2)]" />
      <div className="orb right-[10%] top-44 h-72 w-72 bg-[rgba(246,179,215,0.16)] [animation-delay:1.4s]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[38px] border border-black/8 bg-[rgba(255,255,255,0.84)] shadow-[0_40px_120px_rgba(23,23,25,0.12)] backdrop-blur-xl lg:grid-cols-[1fr_1.02fr]"
      >
        <section className="panel-lines border-b border-black/8 bg-[#171719] p-8 text-[#f6f4ee] lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/86">
            <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
            SmartCode secure access node
          </div>

          <h1 className="mt-7 max-w-xl font-mono text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Enter Your Workspace
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
            Sign in to access your coding dashboard, compete in battles, and track your progress.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6">
            <div className="flex items-center gap-3 text-[var(--accent)]">
              <TerminalSquare className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.28em]">Access Protocol</span>
            </div>

            <div className="mt-5 space-y-3 font-mono text-sm">
              <p className="text-[var(--accent)]">$ init smartcode-session</p>
              <p className="text-white/60">Checking account privileges and coding workspace scope...</p>
              {accessChecks.map((item) => (
                <p key={item} className="text-white/82">
                  <span className="mr-3 text-[var(--accent)]">&gt;</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,244,238,0.96))] p-8 lg:p-10">
          <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/75 px-4 py-2 text-sm text-[var(--foreground)]">
              <LockKeyhole className="h-4 w-4" />
              Member login
            </div>

            <h2 className="mt-6 font-mono text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
              Command access
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Sign in with your account credentials to continue your streak, rankings, and active
              problem-solving sessions.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  placeholder="you@smartcode.dev"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3.5 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3.5 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#111214] px-5 py-3.5 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Enter Dashboard"}
                <ArrowRight className="h-4 w-4 text-[var(--accent)]" />
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-black/8 bg-white/72 p-4 font-mono text-xs text-[var(--muted)]">
              <p className="text-[var(--foreground)]">status: awaiting_credentials</p>
              <p className="mt-2">route: /dashboard</p>
              <p className="mt-1">mode: authenticated_workspace</p>
            </div>

            {message ? <p className="mt-5 text-sm text-[var(--muted-strong)]">{message}</p> : null}

            <p className="mt-6 text-sm text-[var(--muted)]">
              Need a new account?{" "}
              <Link href="/signup" className="font-medium text-[var(--foreground)] transition hover:text-black">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

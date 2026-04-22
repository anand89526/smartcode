"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck, TerminalSquare } from "lucide-react";
import { apiBaseUrl } from "@/lib/api";
import { buildUserProfile, saveUserSession } from "@/lib/session";

const accessChecks = [
  "Full dashboard & coding environment access",
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,255,182,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(61,210,255,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:36px_36px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-emerald-300/12 bg-[#07111dcc] shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[1fr_1.02fr]"
      >
        <section className="panel-lines border-b border-emerald-300/10 bg-[linear-gradient(160deg,rgba(8,18,34,0.98),rgba(5,10,20,0.96))] p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-4 py-2 text-sm text-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            SmartCode secure access node
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Enter Your Workspace
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Sign in to access your coding dashboard, compete in battles, and track your progress.
          </p>

          <div className="mt-8 rounded-[28px] border border-emerald-300/10 bg-[#050c17] p-6">
            <div className="flex items-center gap-3 text-emerald-200">
              <TerminalSquare className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.28em]">Access Protocol</span>
            </div>

            <div className="mt-5 space-y-3 font-mono text-sm">
              <p className="text-emerald-300">$ init smartcode-session</p>
              <p className="text-slate-400">Checking account privileges and coding workspace scope...</p>
              {accessChecks.map((item) => (
                <p key={item} className="text-slate-300">
                  <span className="mr-3 text-emerald-300">&gt;</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,rgba(8,14,24,0.96),rgba(4,8,16,0.98))] p-8 lg:p-10">
          <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/16 bg-cyan-300/8 px-4 py-2 text-sm text-cyan-100">
              <LockKeyhole className="h-4 w-4" />
              Member login
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Command access</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in with your account credentials to continue your streak, rankings, and active
              problem-solving sessions.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  placeholder="you@smartcode.dev"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-[#030812] px-4 py-3.5 text-white outline-none transition focus:border-emerald-300/40 focus:shadow-[0_0_0_4px_rgba(98,255,182,0.08)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-[#030812] px-4 py-3.5 text-white outline-none transition focus:border-emerald-300/40 focus:shadow-[0_0_0_4px_rgba(98,255,182,0.08)]"
                />
              </label>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,#62ffb6,#2fd7ff)] px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Enter Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.03] p-4 font-mono text-xs text-slate-400">
              <p className="text-emerald-300">status: awaiting_credentials</p>
              <p className="mt-2">route: /dashboard</p>
              <p className="mt-1">mode: authenticated_workspace</p>
            </div>

            {message ? <p className="mt-5 text-sm text-slate-300">{message}</p> : null}

            <p className="mt-6 text-sm text-slate-400">
              Need a new account?{" "}
              <Link href="/signup" className="text-emerald-200 transition hover:text-white">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

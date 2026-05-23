"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database, Sparkles, UserPlus } from "lucide-react";
import { apiBaseUrl } from "@/lib/api";

const onboardingPoints = [
  "Create your competitive coding profile",
  "Start solving problems and track your rank",
  "Join real-time battles with other developers",
];

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Unable to create account");

      if (res.ok && data.message === "User registered successfully") {
        setTimeout(() => {
          router.push("/login");
        }, 700);
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Signup request failed. Start the backend and MongoDB first if you want to save users."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4 py-10 text-[var(--foreground)]">
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="orb left-[10%] top-28 h-64 w-64 bg-[rgba(246,179,215,0.18)]" />
      <div className="orb right-[7%] top-52 h-72 w-72 bg-[rgba(121,242,221,0.16)] [animation-delay:1.7s]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[38px] border border-black/8 bg-[rgba(255,255,255,0.84)] shadow-[0_40px_120px_rgba(23,23,25,0.12)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]"
      >
        <section className="panel-lines border-b border-black/8 bg-[#171719] p-8 text-[#f6f4ee] lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/86">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Identity bootstrap
          </div>

          <h1 className="mt-7 max-w-xl font-mono text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            Join the Community
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
            Create your account to start practicing, competing, and climbing the global rankings.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6">
            <div className="flex items-center gap-3 text-[var(--accent)]">
              <Database className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.28em]">Provisioning Flow</span>
            </div>

            <div className="mt-5 space-y-3 font-mono text-sm">
              <p className="text-[var(--accent)]">$ create-user --workspace smartcode</p>
              {onboardingPoints.map((item) => (
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
              <UserPlus className="h-4 w-4" />
              Create account
            </div>

            <h2 className="mt-6 font-mono text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
              Provision access
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Register once and use the same account across dashboard analytics, battles,
              leaderboards, and future backend features.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  placeholder="Your display name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3.5 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

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
                  placeholder="Create a secure password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3.5 text-[var(--foreground)] outline-none transition focus:border-black/18"
                />
              </label>

              <button
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="w-full rounded-[20px] bg-[#111214] px-5 py-3.5 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create SmartCode Account"}
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-black/8 bg-white/72 p-4 font-mono text-xs text-[var(--muted)]">
              <p className="text-[var(--foreground)]">storage: mongodb://127.0.0.1:27017/smartcode</p>
              <p className="mt-2">schema: user_profile + progress_stats</p>
              <p className="mt-1">next_route: /login</p>
            </div>

            {message ? <p className="mt-5 text-sm text-[var(--muted-strong)]">{message}</p> : null}

            <p className="mt-6 text-sm text-[var(--muted)]">
              Already registered?{" "}
              <Link href="/login" className="font-medium text-[var(--foreground)] transition hover:text-black">
                Login
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

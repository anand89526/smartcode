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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,184,77,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(98,255,182,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:34px_34px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[34px] border border-amber-300/12 bg-[#07111dcc] shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]"
      >
        <section className="panel-lines border-b border-amber-300/10 bg-[linear-gradient(160deg,rgba(10,18,32,0.98),rgba(6,10,18,0.98))] p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-4 py-2 text-sm text-amber-100">
            <Sparkles className="h-4 w-4" />
            Identity bootstrap
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Join the Community
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Create your account to start practicing, competing, and climbing the global rankings.
          </p>

          <div className="mt-8 rounded-[28px] border border-amber-300/10 bg-[#050c17] p-6">
            <div className="flex items-center gap-3 text-amber-200">
              <Database className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.28em]">Provisioning Flow</span>
            </div>

            <div className="mt-5 space-y-3 font-mono text-sm">
              <p className="text-amber-300">$ create-user --workspace smartcode</p>
              {onboardingPoints.map((item) => (
                <p key={item} className="text-slate-300">
                  <span className="mr-3 text-amber-300">&gt;</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,rgba(8,14,24,0.96),rgba(4,8,16,0.98))] p-8 lg:p-10">
          <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/16 bg-emerald-300/8 px-4 py-2 text-sm text-emerald-100">
              <UserPlus className="h-4 w-4" />
              Create account
            </div>

            <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Provision access</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Register once and use the same account across dashboard analytics, battles,
              leaderboards, and future backend features.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  placeholder="Your display name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-[#030812] px-4 py-3.5 text-white outline-none transition focus:border-amber-300/40 focus:shadow-[0_0_0_4px_rgba(255,184,77,0.08)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  placeholder="you@smartcode.dev"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-[#030812] px-4 py-3.5 text-white outline-none transition focus:border-amber-300/40 focus:shadow-[0_0_0_4px_rgba(255,184,77,0.08)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-slate-500">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  placeholder="Create a secure password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[20px] border border-white/10 bg-[#030812] px-4 py-3.5 text-white outline-none transition focus:border-amber-300/40 focus:shadow-[0_0_0_4px_rgba(255,184,77,0.08)]"
                />
              </label>

              <button
                type="button"
                onClick={handleSignup}
                disabled={loading}
                className="w-full rounded-[20px] bg-[linear-gradient(135deg,#ffb84d,#62ffb6)] px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create SmartCode Account"}
              </button>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.03] p-4 font-mono text-xs text-slate-400">
              <p className="text-amber-300">storage: mongodb://127.0.0.1:27017/smartcode</p>
              <p className="mt-2">schema: user_profile + progress_stats</p>
              <p className="mt-1">next_route: /login</p>
            </div>

            {message ? <p className="mt-5 text-sm text-slate-300">{message}</p> : null}

            <p className="mt-6 text-sm text-slate-400">
              Already registered?{" "}
              <Link href="/login" className="text-emerald-200 transition hover:text-white">
                Login
              </Link>
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

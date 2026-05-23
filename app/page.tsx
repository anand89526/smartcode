"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroAnimation from "@/components/HeroAnimation";

const features = [
  { icon: "01", label: "Live Battles", desc: "Real-time duels with ranking" },
  { icon: "02", label: "Smart Problems", desc: "Adaptive difficulty progression" },
  { icon: "03", label: "Dashboard", desc: "Complete performance analytics" },
  { icon: "04", label: "Rankings", desc: "Global competitive leaderboards" },
  { icon: "05", label: "Streaks", desc: "Track momentum and consistency" },
  { icon: "06", label: "Code Editor", desc: "Full IDE with instant feedback" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--foreground)]">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="cyber-dots absolute inset-0 opacity-[0.05]" />
      <div className="orb left-[5%] top-24 h-56 w-56 bg-[rgba(121,242,221,0.22)]" />
      <div className="orb right-[8%] top-44 h-72 w-72 bg-[rgba(246,179,215,0.18)] [animation-delay:1.6s]" />

      <Navbar variant="public" />
      <HeroAnimation onExplore={() => router.push("/signup")} />

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-4xl font-bold tracking-[-0.04em] text-[var(--foreground)] md:text-5xl"
          >
            Everything You Need
          </motion.h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-strong)]">
            A cleaner, premium interface with the same product flow underneath it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group rounded-[30px] border border-black/8 bg-[rgba(255,255,255,0.8)] p-6 shadow-[0_22px_60px_rgba(23,23,25,0.08)] backdrop-blur-lg transition hover:bg-white"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#171719] font-mono text-lg font-semibold text-[var(--accent)] transition group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">{feature.label}</h3>
              <p className="text-sm text-[var(--muted)]">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-4xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[36px] border border-black/8 bg-[rgba(255,255,255,0.84)] p-12 shadow-[0_28px_90px_rgba(23,23,25,0.1)] backdrop-blur-lg"
        >
          <h2 className="mb-6 font-mono text-4xl font-bold tracking-[-0.04em] text-[var(--foreground)]">
            About SmartCode
          </h2>
          <p className="mb-4 text-lg text-[var(--muted-strong)]">
            A competitive coding platform built for speed and performance. Practice problems,
            battle other coders in real-time, and climb the global rankings.
          </p>
          <p className="text-base text-[var(--muted)]">
            Sign in to access your dashboard, track progress, join battles, and compete with
            thousands of developers worldwide.
          </p>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/signup")}
              className="rounded-full bg-[#111214] px-8 py-3 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/login")}
              className="rounded-full border border-black/12 bg-white px-8 py-3 font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--page-bg)] hover:shadow-md"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <h3 className="mb-4 font-mono text-2xl font-bold tracking-[-0.04em] text-[var(--foreground)]">
            Ready to compete?
          </h3>
          <p className="mb-8 text-[var(--muted-strong)]">
            Join thousands of developers improving their coding skills.
          </p>
          <div className="inline-flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/signup")}
              className="rounded-full bg-[#111214] px-8 py-3 font-semibold text-[#f6f4ee] shadow-sm transition hover:bg-black hover:shadow-md"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroAnimation from "@/components/HeroAnimation";

const features = [
  { icon: "⚡", label: "Live Battles", desc: "Real-time duels with ranking" },
  { icon: "🎯", label: "Smart Problems", desc: "Adaptive difficulty progression" },
  { icon: "📊", label: "Dashboard", desc: "Complete performance analytics" },
  { icon: "🏆", label: "Rankings", desc: "Global competitive leaderboards" },
  { icon: "📈", label: "Streaks", desc: "Track momentum and consistency" },
  { icon: "💻", label: "Code Editor", desc: "Full IDE with instant feedback" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background Elements */}
      <div className="hero-grid absolute inset-0 opacity-20" />
      <div className="cyber-dots absolute inset-0 opacity-[0.06]" />
      <div className="orb left-[5%] top-24 h-56 w-56 bg-cyan-400/20" />
      <div className="orb right-[8%] top-44 h-72 w-72 bg-emerald-400/18 [animation-delay:1.6s]" />

      <Navbar variant="public" />

      {/* Hero Section */}
      <HeroAnimation onExplore={() => router.push("/signup")} />

      {/* Features Grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-100 to-emerald-200 bg-clip-text text-transparent"
          >
            Everything You Need
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:border-white/20 hover:bg-white/10 transition"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.label}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 mx-auto max-w-4xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-lg"
        >
          <h2 className="text-4xl font-bold mb-6">About SmartCode</h2>
          <p className="text-lg text-slate-300 mb-4">
            A competitive coding platform built for speed and performance. Practice problems, battle other coders in real-time, and climb the global rankings.
          </p>
          <p className="text-base text-slate-400">
            Sign in to access your dashboard, track progress, join battles, and compete with thousands of developers worldwide.
          </p>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/signup")}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-3 font-semibold text-white shadow-lg hover:shadow-cyan-400/50"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/login")}
              className="rounded-full border-2 border-white/30 px-8 py-3 font-semibold text-white hover:border-white/50 hover:bg-white/10"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to compete?</h3>
          <p className="text-slate-300 mb-8">Join thousands of developers improving their coding skills.</p>
          <div className="inline-flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/signup")}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-3 font-semibold text-white"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Swords, Target, Trophy, Zap } from "lucide-react";

type HeroAnimationProps = {
  onExplore?: () => void;
};

const easeOutQuart: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const featureCards = [
  { icon: Swords, label: "Live Battles", desc: "Real-time duels" },
  { icon: Target, label: "Smart Pool", desc: "Adaptive problems" },
  { icon: Trophy, label: "Rankings", desc: "Climb the ladder" },
];

export default function HeroAnimation({ onExplore }: HeroAnimationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOutQuart,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 opacity-20 blur-3xl"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, 30, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-gradient-to-bl from-emerald-400 to-emerald-600 opacity-20 blur-3xl"
          animate={{
            x: [0, -60, 40, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-t from-amber-300 to-amber-500 opacity-15 blur-3xl"
          animate={{
            y: [40, -40, 40],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:100px_100px]" />
      </motion.div>

      <div className="relative z-10 max-w-4xl px-4 text-center">
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-cyan-300" />
          </motion.div>
          <span className="text-sm font-semibold text-cyan-100">Competitive Coding Reimagined</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="bg-gradient-to-br from-white via-cyan-100 to-emerald-200 bg-clip-text text-6xl font-bold leading-tight text-transparent md:text-7xl lg:text-8xl"
        >
          Code. Battle. Rank.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl"
        >
          A competitive coding platform designed for speed, strategy, and skill progression.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(61,210,255,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-400/50 transition hover:shadow-cyan-400/70"
          >
            Get Started
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border-2 border-white/20 px-8 py-4 font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureCards.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.label}
                variants={floatingVariants}
                animate="animate"
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition hover:border-white/20 hover:bg-white/10"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8">
                  <Icon className="h-6 w-6 text-cyan-200" />
                </div>
                <h3 className="font-semibold text-white">{feature.label}</h3>
                <p className="mt-1 text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

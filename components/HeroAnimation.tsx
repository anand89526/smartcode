"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
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
      className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden py-14 sm:py-16"
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
          className="absolute -left-32 top-20 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,#79f2dd,transparent_72%)] opacity-70 blur-3xl sm:block"
          animate={reduceMotion ? undefined : {
            x: [0, 50, -30, 0],
            y: [0, 30, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-40 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,#f6b3d7,transparent_70%)] opacity-65 blur-3xl sm:block"
          animate={reduceMotion ? undefined : {
            x: [0, -60, 40, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 hidden h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#17171930,#17171900_74%)] opacity-90 blur-3xl lg:block"
          animate={reduceMotion ? undefined : {
            y: [40, -40, 40],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(23,23,25,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(23,23,25,0.45)_1px,transparent_1px)] [background-size:100px_100px]" />
      </motion.div>

      <div className="relative z-10 max-w-4xl px-4 text-center">
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-left backdrop-blur-sm"
        >
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-[#171719]" />
          </motion.div>
          <span className="text-sm font-semibold text-[var(--foreground)]">Competitive Coding Reimagined</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-mono text-4xl font-bold leading-tight tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-8xl"
        >
          Code. Battle. Rank.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-base text-[var(--muted-strong)] sm:text-lg md:text-xl"
        >
          A competitive coding platform designed for speed, strategy, and skill progression.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={reduceMotion ? undefined : { scale: 1.05, boxShadow: "0 0 40px rgba(61,210,255,0.3)" }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            onClick={onExplore}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111214] px-8 py-4 font-semibold text-[#f6f4ee] shadow-[0_18px_38px_rgba(23,23,25,0.2)] transition hover:bg-black hover:shadow-[0_22px_50px_rgba(23,23,25,0.28)] sm:w-auto"
          >
            Get Started
            <motion.div animate={reduceMotion ? undefined : { x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.button>

          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.05 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
            <Link
              href="/#about"
              className="flex min-h-12 w-full items-center justify-center rounded-full border border-black/12 bg-white/80 px-8 py-4 font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-white hover:shadow-md sm:w-auto"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-6 md:grid-cols-3">
          {featureCards.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.label}
                variants={reduceMotion ? undefined : floatingVariants}
                animate={reduceMotion ? undefined : "animate"}
                className="group rounded-[28px] border border-black/8 bg-[rgba(255,255,255,0.78)] p-6 backdrop-blur-lg transition hover:-translate-y-1 hover:bg-white"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171719] text-[var(--accent)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{feature.label}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Binary, Shield, Sparkles, TerminalSquare } from "lucide-react";

type CyberOperatorSceneProps = {
  variant?: "home" | "dashboard";
};

export default function CyberOperatorScene({
  variant = "dashboard",
}: CyberOperatorSceneProps) {
  const isDashboard = variant === "dashboard";
  const terminalLines = [
    "const queue = await launchBattleRoom(userId);",
    "analyzeRoadmap({ graphs: true, dp: false });",
    "submitSolution('two-sum', runtime.fastest);",
    "rankPulse.update({ delta: +12, streak: 18 });",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-card-strong cyber-frame interactive-panel relative overflow-hidden rounded-[32px] ${
        isDashboard ? "p-6" : "p-5"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,210,255,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(98,255,182,0.14),transparent_26%)]" />
      <div className="cyber-dots absolute inset-0 opacity-[0.08]" />
      <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/12 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/75">
              {isDashboard ? "Operator Bay" : "Live Interface"}
            </p>
            <h3 className={`mt-2 font-semibold ${isDashboard ? "text-2xl" : "text-xl"}`}>
              {isDashboard ? "3D hacker workspace" : "Immersive coding shell"}
            </h3>
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
            Synced
          </div>
        </div>

        <div
          className={`relative mx-auto ${
            isDashboard ? "h-[320px] max-w-[520px]" : "h-[260px] max-w-[420px]"
          }`}
        >
          <motion.div
            animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 7.5, ease: "easeInOut" }}
            className={`absolute ${
              isDashboard ? "left-6 top-20 w-[230px]" : "left-2 top-18 w-[180px]"
            } rounded-[22px] border border-emerald-300/18 bg-slate-950/82 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]`}
            style={{ transform: "perspective(1000px) rotateY(-14deg) rotateX(8deg)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-300/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-200/80">
                terminal
              </span>
            </div>
            <div className="space-y-2 font-mono text-[10px] leading-5 text-emerald-200">
              {terminalLines.slice(0, isDashboard ? 4 : 3).map((line, index) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.35, 1, 0.55] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3.2,
                    delay: index * 0.35,
                    repeatType: "mirror",
                  }}
                  className={index === 0 ? "type-line whitespace-nowrap" : "whitespace-nowrap"}
                >
                  {`> ${line}`}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: [0, 4, 0, -4, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 12, ease: "easeInOut" }}
            className="absolute left-2 top-4 h-20 w-28 rounded-[24px] border border-cyan-300/20 bg-slate-950/70 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            style={{ transform: "perspective(900px) rotateY(-18deg) rotateX(8deg)" }}
          >
            <TerminalSquare className="h-4 w-4 text-cyan-200" />
            <div className="mt-3 space-y-1">
              <div className="h-1.5 w-12 rounded-full bg-cyan-300/40" />
              <div className="h-1.5 w-16 rounded-full bg-emerald-300/30" />
              <div className="h-1.5 w-10 rounded-full bg-white/15" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 6, ease: "easeInOut" }}
            className="absolute right-4 top-8 h-24 w-32 rounded-[24px] border border-emerald-300/20 bg-slate-950/75 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            style={{ transform: "perspective(900px) rotateY(18deg) rotateX(10deg)" }}
          >
            <div className="flex items-center justify-between">
              <Binary className="h-4 w-4 text-emerald-200" />
              <Shield className="h-4 w-4 text-amber-200" />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-[76%] rounded-full bg-[linear-gradient(90deg,#62ffb6,#3dd2ff)]" />
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-8 w-8 rounded-xl bg-cyan-300/12" />
              <div className="h-8 w-8 rounded-xl bg-emerald-300/12" />
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-1/2 h-10 w-[88%] -translate-x-1/2 rounded-full bg-black/45 blur-2xl" />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5.4, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -left-10 top-18 h-28 w-12 rounded-full bg-cyan-400/10 blur-xl" />
              <div className="absolute -right-10 top-18 h-28 w-12 rounded-full bg-emerald-400/10 blur-xl" />

              <div className="mx-auto h-16 w-16 rounded-full border border-white/10 bg-[linear-gradient(180deg,#17283f,#0c1424)] shadow-[0_10px_30px_rgba(0,0,0,0.45)]" />
              <div className="mx-auto mt-2 h-20 w-28 rounded-t-[28px] rounded-b-[22px] border border-white/10 bg-[linear-gradient(180deg,#15253c,#0c1420)]" />

              <div className="absolute -left-16 top-20 h-16 w-12 rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,#122034,#0a121f)]" style={{ transform: "rotate(18deg)" }} />
              <div className="absolute -right-16 top-20 h-16 w-12 rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,#122034,#0a121f)]" style={{ transform: "rotate(-18deg)" }} />

              <div className="mt-4 flex items-end justify-center gap-4">
                <div className="h-20 w-14 rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,#122034,#0a121f)]" />
                <div className="h-24 w-16 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,#122034,#0a121f)]" />
              </div>
            </motion.div>
          </div>

          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8.5, ease: "easeInOut" }}
            className={`absolute ${
              isDashboard ? "bottom-24 left-12 h-14 w-14" : "bottom-20 left-6 h-12 w-12"
            } rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 shadow-[0_15px_35px_rgba(0,0,0,0.25)]`}
          >
            <Sparkles className="h-full w-full text-amber-200" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 9, ease: "easeInOut" }}
            className={`absolute ${
              isDashboard ? "bottom-18 right-10 h-16 w-28" : "bottom-16 right-6 h-14 w-24"
            } rounded-[22px] border border-cyan-300/18 bg-slate-950/78 p-3 shadow-[0_18px_45px_rgba(0,0,0,0.32)]`}
            style={{ transform: "perspective(900px) rotateY(20deg)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200/75">
              runtime
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                animate={{ width: ["62%", "81%", "70%"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4.8, ease: "easeInOut" }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#62ffb6,#3dd2ff)]"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>fast</span>
              <span>12ms</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

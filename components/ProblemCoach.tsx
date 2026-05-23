"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, LoaderCircle, MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { apiBaseUrl } from "@/lib/api";

type CoachMessage = {
  role: "assistant" | "user";
  content: string;
};

type ProblemCoachProps = {
  problemId: string;
  problemTitle: string;
  problemDifficulty: string;
};

const quickPrompts = [
  "Give me a first hint",
  "What pattern should I think about?",
  "Explain the logic, not the code",
  "What edge cases should I test?",
];

export default function ProblemCoach({
  problemId,
  problemTitle,
  problemDifficulty,
}: ProblemCoachProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const introMessage = useMemo<CoachMessage>(
    () => ({
      role: "assistant",
      content: `I’m your problem coach for "${problemTitle}" (${problemDifficulty}). I can help with hints, approach, logic walkthroughs, complexity thinking, and edge cases without giving the full solution.`
    }),
    [problemDifficulty, problemTitle]
  );

  useEffect(() => {
    setMessages([introMessage]);
  }, [introMessage, problemId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, open]);

  async function askCoach(prompt: string) {
    const trimmed = prompt.trim();

    if (!trimmed || loading) {
      return;
    }

    const nextMessages: CoachMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/problems/${problemId}/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Coach unavailable");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: payload.reply || "I couldn’t generate guidance right now." }
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Coach unavailable";
      setMessages((current) => [
        ...current,
        { role: "assistant", content: `I hit a problem while loading guidance. ${message}.` }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-black/10 bg-[rgba(255,255,255,0.88)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[0_24px_60px_rgba(23,23,25,0.14)] backdrop-blur-xl md:bottom-7 md:right-7"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171719] text-[var(--accent)]">
          <Bot className="h-5 w-5" />
        </span>
        <span className="hidden sm:block">
          Ask Smart Coach
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed inset-x-3 bottom-3 z-50 flex max-h-[82vh] flex-col overflow-hidden rounded-[28px] border border-black/10 bg-[rgba(255,255,255,0.95)] shadow-[0_30px_90px_rgba(23,23,25,0.18)] backdrop-blur-xl sm:inset-x-auto sm:right-7 sm:w-[420px]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/8 bg-[radial-gradient(circle_at_top_left,rgba(121,242,221,0.22),transparent_45%),#f7f4ee] px-5 py-4">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Smart Coach
                </p>
                <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">{problemTitle}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Hints, logic, and direction only. No full solution reveal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 p-2 text-[var(--muted)] transition hover:border-black/20 hover:bg-black/5 hover:text-[var(--foreground)]"
                aria-label="Close coach"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => askCoach(prompt)}
                    className="rounded-full border border-black/10 bg-[rgba(247,244,238,0.88)] px-3 py-2 text-xs text-[var(--muted-strong)] transition hover:border-black/18 hover:bg-black/5 hover:text-[var(--foreground)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#171719] text-[#f6f4ee]"
                        : "border border-black/8 bg-[rgba(247,244,238,0.88)] text-[var(--foreground)]"
                    }`}
                  >
                    <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {message.role === "user" ? <MessageSquareText className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                      {message.role === "user" ? "You" : "Coach"}
                    </p>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-black/8 bg-[rgba(247,244,238,0.88)] px-4 py-3 text-sm text-[var(--muted-strong)]">
                    <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      <Bot className="h-3.5 w-3.5" />
                      Coach
                    </p>
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Thinking through the problem...
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void askCoach(input);
              }}
              className="border-t border-black/8 px-4 py-4"
            >
              <div className="flex items-end gap-3 rounded-[22px] border border-black/10 bg-[rgba(247,244,238,0.9)] p-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask for a hint, approach, or logic explanation..."
                  rows={2}
                  className="min-h-[56px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#171719] text-[var(--accent)] transition hover:shadow-[0_0_24px_rgba(23,23,25,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

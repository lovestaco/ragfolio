import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const apiBaseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api";

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 3500);

      try {
        const res = await fetch(`${apiBaseUrl}/health`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!cancelled) setBackendOnline(res.ok);
      } catch {
        if (!cancelled) setBackendOnline(false);
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    void checkHealth();
    const intervalId = window.setInterval(() => {
      void checkHealth();
    }, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [apiBaseUrl]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

      const response = await fetch(`${apiBaseUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: content }),
        signal: controller.signal,
      });

      const rawText = await response.text();
      const data = rawText
        ? (() => {
            try {
              return JSON.parse(rawText);
            } catch {
              return null;
            }
          })()
        : null;

      if (!response.ok) {
        const detail =
          (data &&
          typeof data === "object" &&
          "detail" in data &&
          typeof (data as any).detail === "string"
            ? (data as any).detail
            : null) ?? rawText?.trim();
        throw new Error(detail || `Request failed (${response.status}).`);
      }

      const answer =
        (data &&
        typeof data === "object" &&
        "answer" in data &&
        typeof (data as any).answer === "string"
          ? (data as any).answer
          : null) ?? rawText?.trim();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer || "I received an empty response from the backend.",
        },
      ]);
      setBackendOnline(true);

      window.clearTimeout(timeoutId);
    } catch (error: any) {
      const errorMessage =
        error?.name === "AbortError"
          ? "Request timed out. Please try again."
          : error?.message ||
            "Network error. Please make sure the backend is running.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`,
        },
      ]);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 border-t border-zinc-800/50 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          layout
          initial={false}
          animate={{ height: messages.length === 0 ? 240 : 500 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl overflow-hidden flex flex-col shadow-2xl shadow-blue-500/5 ring-1 ring-white/5"
        >
          <div className="px-6 py-3 border-b border-zinc-800/60 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-200">Chat</div>
            <div className="text-xs text-zinc-400">
              Backend:{" "}
              <span
                className={
                  backendOnline === null
                    ? "text-zinc-400"
                    : backendOnline
                      ? "text-emerald-400"
                      : "text-rose-400"
                }
              >
                {backendOnline === null
                  ? "Checking…"
                  : backendOnline
                    ? "Online"
                    : "Offline"}
              </span>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4 border border-zinc-700/50 shadow-inner">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-zinc-100 font-semibold text-lg mb-1">
                      Get to know me
                    </h3>
                    <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed">
                      Ask about my specific skills, professional experience, or
                      previous projects.
                    </p>
                  </div>
                </motion.div>
              ) : (
                messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} content={m.content} />
                ))
              )}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-zinc-800/80 rounded-2xl rounded-tl-none px-5 py-3 border border-zinc-700/50">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <ChatInput
            onSend={handleSend}
            disabled={loading}
            isFirstTime={messages.length === 0}
          />
        </motion.div>
      </div>
    </section>
  );
}

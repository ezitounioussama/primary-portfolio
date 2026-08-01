"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const IRIDESCENT =
    "conic-gradient(from 0deg, #ff5f9e, #a78bfa, #38bdf8, #34d399, #fbbf24, #fb7185, #ff5f9e)";

const GREETING = {
    role: "assistant",
    content:
        "Hi! I'm Oussama's portfolio assistant. feel free to ask",
};

/**
 * Floating AI assistant (bottom-right). Streams answers from /api/chat,
 * which proxies a minimal local model (qwen2.5:0.5b) served by an Ollama
 * container — the fullstack path is real: widget → Route Handler → Ollama.
 */
export default function AssistantWidget() {
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const openTl = useRef(null);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);

    useGSAP(
        () => {
            gsap.set(panelRef.current, {
                autoAlpha: 0,
                y: 24,
                scale: 0.92,
                transformOrigin: "bottom right",
            });
            openTl.current = gsap
                .timeline({ paused: true })
                .to(panelRef.current, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.35,
                    ease: "power3.out",
                });
        },
        { scope: rootRef },
    );

    useEffect(() => {
        if (open) {
            openTl.current?.play();
            inputRef.current?.focus();
        } else {
            openTl.current?.reverse();
        }
    }, [open]);

    // Keep the newest message in view while streaming.
    // biome-ignore lint/correctness/useExhaustiveDependencies: scroll reacts to message changes
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages]);

    async function send(e) {
        e?.preventDefault();
        const text = input.trim();
        if (!text || busy) return;
        setInput("");
        setBusy(true);

        const history = [...messages, { role: "user", content: text }];
        // Placeholder bubble that the stream fills in.
        setMessages([...history, { role: "assistant", content: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Greeting is UI-only; don't spend model context on it.
                body: JSON.stringify({ messages: history.slice(1) }),
            });
            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "offline");
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                acc += decoder.decode(value, { stream: true });
                const snapshot = acc;
                setMessages((prev) => {
                    const next = prev.slice(0, -1);
                    return [...next, { role: "assistant", content: snapshot }];
                });
            }
            if (!acc.trim()) throw new Error("empty");
        } catch {
            setMessages((prev) => {
                const next = prev.slice(0, -1);
                return [
                    ...next,
                    {
                        role: "assistant",
                        content:
                            "I seem to be offline right now — please use the contact form below, or email directly. 📮",
                    },
                ];
            });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div ref={rootRef}>
            {/* Panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-label="Portfolio assistant chat"
                className="fixed bottom-[10.5rem] right-4 z-50 flex h-[24rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background/85 shadow-2xl backdrop-blur-xl md:bottom-24 md:right-6 md:h-[26rem]"
            >
                {/* Header */}
                <header className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <span
                        aria-hidden="true"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-background"
                        style={{ background: IRIDESCENT }}
                    >
                        <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-tight">
                            Ask about Oussama
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                            qwen2.5 0.5b · self-hosted
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close chat"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
                    data-lenis-prevent
                >
                    {messages.map((m, i) => (
                        <div
                            key={`${i}-${m.role}`}
                            className={cn(
                                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                                m.role === "user"
                                    ? "ml-auto rounded-br-sm bg-foreground text-background"
                                    : "rounded-bl-sm border border-border bg-foreground/5 text-foreground",
                            )}
                        >
                            {m.content || (
                                <span className="inline-flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form
                    onSubmit={send}
                    className="flex items-center gap-2 border-t border-border p-3"
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        maxLength={500}
                        placeholder="e.g. What's his stack?"
                        aria-label="Message the assistant"
                        className="min-w-0 flex-1 rounded-full border border-border bg-foreground/5 px-4 py-2 text-sm outline-none transition-colors focus:border-foreground"
                    />
                    <button
                        type="submit"
                        disabled={busy || !input.trim()}
                        aria-label="Send message"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* Launcher */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close assistant" : "Open assistant chat"}
                aria-expanded={open}
                className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/70 text-foreground shadow-xl backdrop-blur-xl transition-transform hover:scale-105 md:bottom-6 md:right-6"
            >
                <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full opacity-40 blur-[6px]"
                    style={{ background: IRIDESCENT }}
                />
                <Sparkles className="relative h-5 w-5" />
            </button>
        </div>
    );
}

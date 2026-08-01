import { PROFILE, TIMELINE } from "@/lib/data";

// Ollama lives in a sibling container (compose) or on localhost (dev).
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:0.5b";

// Small models need short leashes: tight persona, tight output budget.
const SYSTEM_PROMPT = `You are the portfolio assistant on ${PROFILE.name}'s website.
Answer questions about Oussama using ONLY these facts:

- ${PROFILE.name}, ${PROFILE.role}, based in ${PROFILE.location}.
- ${PROFILE.summary}
- Roles: ${TIMELINE.map((t) => `${t.role} at ${t.org} (${t.period})`).join("; ")}.
- Stack: JavaScript/TypeScript (React, Next.js, Node, NestJS), PHP (Symfony, Laravel, PRADO), Python data science, Docker/Kubernetes/CI-CD.
- Contact: ${PROFILE.email} — or the contact form on this page.
- CV: /cv.pdf · GitHub: ${PROFILE.github} · LinkedIn: ${PROFILE.linkedin}

Rules: reply in 1-3 short sentences. Be friendly and factual. If asked something
unrelated to Oussama or his work, say you only answer questions about Oussama
and suggest using the contact form. Never invent facts.`;

const MAX_MESSAGES = 12;
const MAX_CHARS = 500;

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    // Never trust the client: clamp roles, length, and count.
    const messages = incoming
        .filter(
            (m) =>
                (m?.role === "user" || m?.role === "assistant") &&
                typeof m?.content === "string" &&
                m.content.trim().length > 0,
        )
        .slice(-MAX_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

    if (messages.length === 0 || messages.at(-1).role !== "user") {
        return Response.json({ error: "No user message" }, { status: 400 });
    }

    let upstream;
    try {
        upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                stream: true,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages,
                ],
                options: {
                    temperature: 0.5,
                    num_predict: 220,
                },
            }),
            signal: AbortSignal.timeout(60_000),
        });
    } catch {
        return Response.json(
            { error: "The assistant is offline right now." },
            { status: 503 },
        );
    }

    if (!upstream.ok || !upstream.body) {
        return Response.json(
            { error: "The assistant is offline right now." },
            { status: 503 },
        );
    }

    // Ollama streams NDJSON lines; forward only the text deltas.
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    const toText = new TransformStream({
        transform(chunk, controller) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    const delta = data?.message?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                } catch {
                    // Ignore malformed lines rather than killing the stream.
                }
            }
        },
    });

    return new Response(upstream.body.pipeThrough(toText), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}

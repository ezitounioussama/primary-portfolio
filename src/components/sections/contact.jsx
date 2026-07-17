"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useActionState, useRef } from "react";
import { submitContact } from "@/app/actions";
import { PROFILE } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const initialState = { ok: false, errors: {}, message: "" };

export default function Contact() {
    const rootRef = useRef(null);
    const [state, formAction, pending] = useActionState(
        submitContact,
        initialState,
    );

    useGSAP(
        () => {
            gsap.from(".contact-reveal", {
                y: 40,
                opacity: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
            });
        },
        { scope: rootRef },
    );

    return (
        <section
            id="contact"
            ref={rootRef}
            className="relative mx-auto max-w-3xl px-6 py-28 md:py-40"
        >
            <h2 className="contact-reveal text-4xl font-semibold tracking-tight md:text-6xl">
                Let&apos;s build something.
            </h2>
            <p className="contact-reveal mt-4 max-w-md text-muted-foreground">
                Have a project in mind? Send a note and I&apos;ll reply within a
                couple of days — or reach me directly at{" "}
                <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-foreground underline underline-offset-4 hover:text-accent-4"
                >
                    {PROFILE.email}
                </a>
                .
            </p>
            <p className="contact-reveal mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                I take on{" "}
                <span className="text-foreground">full-stack builds</span>,{" "}
                <span className="text-foreground">architecture reviews</span>,
                and <span className="text-foreground">performance audits</span>{" "}
                — for startups and enterprise teams, remote or from Rabat.
            </p>

            {/* Social proof */}
            <blockquote className="contact-reveal mt-8 max-w-md border-l-2 border-accent-4 pl-4 text-sm italic leading-relaxed text-muted-foreground">
                &ldquo;Oussama is the engineer we hand the hardest problems to —
                he owns them from architecture to the last deploy.&rdquo;
                <footer className="mt-2 font-mono text-xs not-italic text-muted-foreground/80">
                    — Engineering Manager, Intelcia Tech
                </footer>
            </blockquote>

            {state.ok ? (
                <p className="contact-reveal mt-10 rounded-lg border border-accent-3/40 bg-accent-3/10 px-5 py-4 text-sm">
                    {state.message}
                </p>
            ) : (
                <form
                    action={formAction}
                    className="contact-reveal mt-10 grid gap-5"
                >
                    <Field
                        label="Name"
                        name="name"
                        type="text"
                        error={state.errors?.name}
                        autoComplete="name"
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        error={state.errors?.email}
                        autoComplete="email"
                    />
                    <div className="grid gap-2">
                        <label
                            htmlFor="message"
                            className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            className="resize-none rounded-lg border border-border bg-foreground/5 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                        />
                        {state.errors?.message ? (
                            <span className="text-xs text-destructive">
                                {state.errors.message}
                            </span>
                        ) : null}
                    </div>

                    {state.message && !state.ok ? (
                        <p className="text-xs text-destructive">
                            {state.message}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={pending}
                        className="mt-2 w-fit rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {pending ? "Sending…" : "Send message"}
                    </button>
                </form>
            )}

            <footer className="contact-reveal mt-24 border-t border-border pt-8 font-mono text-xs text-muted-foreground">
                <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
                    <a
                        href={PROFILE.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block py-1.5 transition-colors hover:text-foreground"
                    >
                        GitHub
                    </a>
                    <a
                        href={PROFILE.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block py-1.5 transition-colors hover:text-foreground"
                    >
                        LinkedIn
                    </a>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                        © {new Date().getFullYear()} {PROFILE.name} ·{" "}
                        {PROFILE.location}
                    </span>
                    <span>Built with Next.js · GSAP · Lenis</span>
                </div>
            </footer>
        </section>
    );
}

function Field({ label, name, type, error, autoComplete }) {
    return (
        <div className="grid gap-2">
            <label
                htmlFor={name}
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                className="rounded-lg border border-border bg-foreground/5 px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
            />
            {error ? (
                <span className="text-xs text-destructive">{error}</span>
            ) : null}
        </div>
    );
}

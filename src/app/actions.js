"use server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form Server Action. Used with useActionState on the client.
 * Validates on the server (Server Actions are reachable via direct POST, so
 * never trust the client) and returns a serializable result object.
 */
export async function submitContact(_prevState, formData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const errors = {};
    if (name.length < 2) errors.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
    if (message.length < 10) errors.message = "Message is a little short.";

    if (Object.keys(errors).length > 0) {
        return { ok: false, errors, message: "Please fix the fields above." };
    }

    // Persist / forward the message. Wire up email, DB, or webhook here.
    // For now we log server-side so the fullstack path is real end to end.
    console.log("[contact]", { name, email, message });

    return {
        ok: true,
        errors: {},
        message: "Thanks — I'll get back to you soon.",
    };
}

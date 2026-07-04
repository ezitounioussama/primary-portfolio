import { ImageResponse } from "next/og";
import { PROFILE } from "@/lib/data";

// Auto-used for both Open Graph and Twitter card images.
export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#0a0a0a",
                color: "#ededed",
                padding: "80px",
                fontFamily: "sans-serif",
                position: "relative",
            }}
        >
            {/* Holographic orb glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-160px",
                    right: "-120px",
                    width: "560px",
                    height: "560px",
                    borderRadius: "9999px",
                    background:
                        "radial-gradient(circle at 32% 30%, #ff5f9e, #a78bfa 35%, #38bdf8 60%, #34d399 80%, #fbbf24 100%)",
                    filter: "blur(20px)",
                    opacity: 0.85,
                }}
            />

            <div
                style={{
                    display: "flex",
                    fontSize: 26,
                    letterSpacing: 6,
                    opacity: 0.7,
                    textTransform: "uppercase",
                }}
            >
                {PROFILE.location}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        display: "flex",
                        fontSize: 92,
                        fontWeight: 700,
                        lineHeight: 1.02,
                    }}
                >
                    {PROFILE.name}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 40,
                        marginTop: 16,
                        color: "#a78bfa",
                    }}
                >
                    {PROFILE.role}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 28,
                        marginTop: 20,
                        opacity: 0.7,
                    }}
                >
                    {PROFILE.tagline}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 26,
                    opacity: 0.7,
                }}
            >
                <span>{PROFILE.email}</span>
                <span>gotodev.ma</span>
            </div>
        </div>,
        { ...size },
    );
}

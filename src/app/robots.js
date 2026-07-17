import { SITE_URL } from "@/lib/data";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            {
                // Explicitly welcome the major search + AI crawlers.
                userAgent: [
                    "Googlebot",
                    "Googlebot-Image",
                    "Bingbot",
                    "DuckDuckBot",
                    "GPTBot",
                    "OAI-SearchBot",
                    "ClaudeBot",
                    "PerplexityBot",
                    "Google-Extended",
                ],
                allow: "/",
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}

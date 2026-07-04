import { SITE_URL } from "@/lib/data";

// Single-page portfolio: the home document is the one indexable URL.
export default function sitemap() {
    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
    ];
}

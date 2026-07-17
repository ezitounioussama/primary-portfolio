import { SITE_URL } from "@/lib/data";

// Single-page portfolio: the home document is the one indexable URL.
export default function sitemap() {
    return [
        {
            url: SITE_URL,
            // Pin to the last real content change (build timestamps create
            // phantom freshness signals). Update on substantive edits.
            lastModified: new Date("2026-07-17"),
        },
    ];
}

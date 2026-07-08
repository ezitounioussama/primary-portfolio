import NotFoundScene from "@/components/not-found-scene";

export const metadata = {
    title: "404 — Page not found",
    robots: { index: false },
};

export default function NotFound() {
    return <NotFoundScene />;
}

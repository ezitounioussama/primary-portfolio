/** @type {import('next').NextConfig} */
const nextConfig = {
    // Self-contained server bundle for Docker (.next/standalone + server.js).
    output: "standalone",
    // Don't advertise the framework (fingerprinting).
    poweredByHeader: false,
    // Security headers at the app layer so they hold on any host.
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

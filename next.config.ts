import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/proxy/:path*",
                destination: "https://tagxl.com/api/:path*",
            },
        ];
    },
};

export default nextConfig;

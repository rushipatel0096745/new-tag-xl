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
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
        proxyClientMaxBodySize: "50mb",
    },
};

export default nextConfig;

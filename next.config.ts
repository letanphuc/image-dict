import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        domains: ['api.together.ai'],
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // {
            //     protocol: 'https',
            //     hostname: 'shop.compass25.ru',
            // },
            // {
            //     protocol: 'http',
            //     hostname: 90'.156.134.142',
            //     port: '1337'
            // },
        ],
    },
    experimental: {
        viewTransition: true,
    },
};

export default nextConfig;
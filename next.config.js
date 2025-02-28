/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['heritage.top-wp.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'heritage.top-wp.com',
                pathname: '/**',
            },
        ],
        unoptimized: true, 
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                ],
            },
        ]
    },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  allowedDevOrigins: [
    'a5b6b71319e1f017-197-45-86-39.serveousercontent.com',
    '*.serveousercontent.com'
  ],
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  async headers() {

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://t.me https://web.telegram.org https://*.serveousercontent.com",
          },

          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://t.me',
          },
        ],
      },
    ];
  },
};

export default nextConfig;



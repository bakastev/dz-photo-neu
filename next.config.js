/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qljgbskxopjkivkcuypu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dz-photo.at',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shortpixel.ai',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    qualities: [70, 75, 90],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Blog Route Änderung: /tipp → /blog
      {
        source: '/tipp/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Alte WordPress URLs
      {
        source: '/hochzeit-:slug/',
        destination: '/hochzeit/:slug',
        permanent: true,
      },
      {
        source: '/hochzeitsfotograf-linz-wels/locations/:slug/',
        destination: '/locations/:slug',
        permanent: true,
      },
      {
        source: '/fotobox-blitzangebot/',
        destination: '/fotobox',
        permanent: true,
      },
      {
        source: '/fotoboxlayouts/',
        destination: '/fotobox',
        permanent: true,
      },
      {
        source: '/kontakt-anfrage/',
        destination: '/#contact',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

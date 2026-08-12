import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    // CMS uploads are served from Convex file storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.convex.cloud" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Authenticated pages moved under /dashboard so the route group and the
      // URL agree, and so the auth matcher covers them structurally.
      { source: "/account", destination: "/dashboard/account", permanent: true },
      // The jobs board is retired; /jobs URLs are already indexed, so send
      // them home rather than serving 404s.
      { source: "/jobs", destination: "/", permanent: true },
      { source: "/jobs/:path*", destination: "/", permanent: true },
      // Certification and workshop indexes are consolidated into /programs.
      // Their detail pages keep their own URLs and are untouched.
      { source: "/certifications", destination: "/programs", permanent: true },
      { source: "/workshops", destination: "/programs", permanent: true },
      // The waitlist is replaced by open sign-up.
      { source: "/waitlist", destination: "/sign-up", permanent: true },
      // The admin CMS moved under /dashboard so there is one authenticated
      // surface, filtered by role, rather than two.
      { source: "/admin", destination: "/dashboard", permanent: true },
      { source: "/admin/content/:path*", destination: "/dashboard/content/:path*", permanent: true },
      { source: "/admin/media", destination: "/dashboard/media", permanent: true },
      { source: "/admin/organizations", destination: "/dashboard/organisations", permanent: true },
      { source: "/admin/settings", destination: "/dashboard/settings", permanent: true },
      { source: "/admin/users", destination: "/dashboard/users", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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

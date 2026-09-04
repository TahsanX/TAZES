import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's generated client does dynamic filesystem access for its query
  // engine binary; marking it external keeps Next from tracing the whole
  // repo into the server bundle.
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;

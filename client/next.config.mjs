/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.VITE_API_URL ||
      "https://ai-customer-feedback-intelligence-m4fd.onrender.com",
  },
};

export default nextConfig;

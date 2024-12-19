// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    
    experimental: {
      appDir: true,
    },
    images: {
      domains: ['i.ytimg.com', 'i9.ytimg.com' , "yt3.ggpht.com"],
    },
  };
  
  export default nextConfig;
  
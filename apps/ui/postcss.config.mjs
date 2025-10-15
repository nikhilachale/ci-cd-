// Conditional PostCSS config for Docker compatibility
const config = {
  plugins: process.env.DISABLE_LIGHTNINGCSS ? 
    ["postcss-import"] : // Use basic import processing for Docker
    ["@tailwindcss/postcss"], // Use LightningCSS when available
};

export default config;

import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";
// import netlify from "@astrojs/netlify";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
// import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), tailwind(), db()],
  output: "server",
  adapter: vercel()
});
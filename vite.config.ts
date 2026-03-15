import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Safely import lovable-tagger — only used in Lovable's dev environment
let componentTagger: ((options?: unknown) => unknown) | null = null;
try {
  const mod = await import("lovable-tagger");
  componentTagger = mod.componentTagger;
} catch {
  // Not available outside Lovable (e.g. on Vercel) — skip silently
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger ? componentTagger() : false,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

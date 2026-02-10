import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import path from "path"

export default defineConfig({
  server: {
    port: 5179,
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    ConfigPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Watchlist",
        short_name: "watchlist",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#660000",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
})

import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import { ConfigPlugin } from "@dxos/config/vite-plugin"
import path from "path"

/**
 * Vite plugin that fixes a Rollup TDZ (temporal dead zone) bug affecting DXOS.
 *
 * Rollup generates `let _inspectCustom` declarations AFTER the class body that
 * references them via computed property keys (`[_inspectCustom = inspectCustom]`).
 * Since `let` bindings are hoisted but not initialized, accessing them before the
 * declaration causes "Cannot access '_inspectCustom' before initialization".
 *
 * This plugin changes those specific `let` declarations to `var`, which hoists
 * with `undefined` initialization and avoids the TDZ.
 */
function fixRollupTdzPlugin(): Plugin {
  return {
    name: "fix-rollup-tdz",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.code.includes("_inspectCustom")) {
          chunk.code = chunk.code.replace(/\blet\b([^;]*\b_inspectCustom\b)/g, "var$1")
        }
      }
    },
  }
}

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
    fixRollupTdzPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Watchlist",
        short_name: "watchlist",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#660000",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
      },
    }),
  ],
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm(), fixRollupTdzPlugin()],
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

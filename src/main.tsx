import { ClientProvider } from "@dxos/react-client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { App } from "./App"
import { getConfig } from "@/config"
import { WatchlistItem } from "@/schema/WatchlistItem"

/**
 * NOTE: The `shell` prop is omitted because @dxos/shell@0.8.3 bundles React 18
 * jsx-runtime code that references ReactCurrentDispatcher, which was removed in
 * React 19. The shell iframe crashes on load and blocks client initialization.
 * Re-enable `shell="./shell.html"` after upgrading DXOS to a React 19-compatible version.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClientProvider
      config={getConfig}
      types={[WatchlistItem]}
      createWorker={() =>
        new SharedWorker(new URL("./shared-worker", import.meta.url), {
          type: "module",
          name: "dxos-client-worker",
        })
      }
      onInitialized={async client => {
        if (!client.halo.identity.get()) {
          await client.halo.createIdentity()
        }
      }}
    >
      <App />
    </ClientProvider>
  </StrictMode>,
)

import { ClientProvider } from "@dxos/react-client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import "./index.css"
import { getConfig } from "@/config"
import { Layout } from "@/routes/Layout"
import { DiscoverPage } from "@/routes/DiscoverPage"
import { WatchlistPage } from "@/routes/WatchlistPage"
import { DetailPage } from "@/routes/DetailPage"
import { WatchlistItem } from "@/schema/WatchlistItem"

/** Browser router with all application routes. */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/movies/discover" replace />,
  },
  {
    path: "/:mediaType",
    element: <Layout />,
    children: [
      { path: "discover", element: <DiscoverPage /> },
      { path: "watchlist", element: <WatchlistPage /> },
      { path: ":tmdbId", element: <DetailPage /> },
    ],
  },
])

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
      <RouterProvider router={router} />
    </ClientProvider>
  </StrictMode>,
)

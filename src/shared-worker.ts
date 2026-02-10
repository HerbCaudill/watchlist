/**
 * DXOS shared worker entry point. ECHO runs inside this SharedWorker so that
 * multiple tabs share a single client instance. The async import works around
 * a WASM + top-level-await issue in Vite.
 * See: https://github.com/Menci/vite-plugin-wasm/issues/37
 */
onconnect = async (event: MessageEvent) => {
  const { onconnect } = await import("@dxos/react-client/worker")
  await onconnect(event)
}

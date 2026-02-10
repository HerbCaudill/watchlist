declare module "@dxos/config/vite-plugin" {
  import type { Plugin } from "vite"

  interface ConfigPluginOptions {
    configPath?: string
    envPath?: string
    devPath?: string
    mode?: string
    publicUrl?: string
    env?: string[]
  }

  export function ConfigPlugin(options?: ConfigPluginOptions): Plugin
}

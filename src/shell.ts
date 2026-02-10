import "@dxos/shell/style.css"

import { runShell } from "@dxos/shell"

import { getConfig } from "./config"

/** Boot the HALO identity shell in the shell iframe. */
const main = async () => {
  const config = await getConfig()
  await runShell(config)
}

void main()

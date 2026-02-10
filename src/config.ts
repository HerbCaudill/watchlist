import { Config, Defaults, Envs, Local } from "@dxos/config"

/** Create the DXOS config by layering environment, local, and default settings. */
export const getConfig = async () => new Config(await Envs(), Local(), Defaults())

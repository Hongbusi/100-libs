import type { Agent } from './agents'

interface Config {
  defaultAgent: Agent | 'prompt'
  globalAgent: Agent
}

const defaultConfig: Config = {
  defaultAgent: 'prompt',
  globalAgent: 'npm',
}

let config: Config | undefined

export function getConfig(): Config {
  if (!config)
    config = defaultConfig

  return config
}

export async function getDefaultAgent() {
  const { defaultAgent } = await getConfig()
  return defaultAgent
}

export async function getGlobalAgent() {
  const { globalAgent } = await getConfig()
  return globalAgent
}

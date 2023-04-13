import fs from 'node:fs'
import path from 'node:path'
import { findUp } from 'find-up'
import type { Agent } from './agents'
import { AGENTS, LOCKS } from './agents'

export async function detect({ cwd }) {
  let agent: Agent | null = null

  const lockPath = await findUp(Object.keys(LOCKS), { cwd })
  let packageJsonPath: string | undefined

  if (lockPath)
    packageJsonPath = path.resolve(lockPath, '../package.json')
  else
    packageJsonPath = await findUp('package.json', { cwd })

  if (packageJsonPath && fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (typeof pkg.packageManager === 'string') {
        const [name] = pkg.packageManager.split('@')
        if (name in AGENTS)
          agent = name
        else
          console.warn('[001-ni] Unknown packageManager:', pkg.packageManager)
      }
    }
    catch {}
  }

  if (!agent && lockPath)
    agent = LOCKS[path.basename(lockPath)]

  return agent
}

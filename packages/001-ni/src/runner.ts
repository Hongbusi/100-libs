/* eslint-disable no-console */
import { resolve } from 'node:path'
import prompts from '@posva/prompts'
import { execaCommand } from 'execa'
import type { Agent } from './agents'
import { agents } from './agents'
import { detect } from './detect'
import { getDefaultAgent } from './config'
import { remove } from './utils'

const DEBUG_SIGN = '?'

export interface RunnerContext {
  cwd?: string
  hasLock?: boolean
}

export type Runner = (agent: Agent, args: string[], ctx?: RunnerContext) => Promise<string | undefined> | string | undefined

export async function runCli(fn: Runner) {
  const args = process.argv.slice(2).filter(Boolean)
  try {
    await run(fn, args)
  }
  catch (error) {
    console.log(error)
    process.exit(1)
  }
}

async function run(fn: Runner, args: string[]) {
  const debug = args.includes(DEBUG_SIGN)
  if (debug)
    remove(args, DEBUG_SIGN)

  let cwd = process.cwd()

  if (args.length === 1 && (['-v', '--version'].includes(args[0]))) {
    console.log('001-ni v0.0.1')
    return
  }

  if (args[0] === '-C') {
    cwd = resolve(cwd, args[1])
    args = args.slice(2)
  }

  let agent = await detect({ cwd }) || await getDefaultAgent()
  if (agent === 'prompt') {
    agent = (await prompts({
      name: 'agent',
      type: 'select',
      message: 'Choose the agent',
      choices: agents.map(agent => ({ title: agent, value: agent })),
    })).agent
  }

  const command = await fn(agent as Agent, args, { hasLock: Boolean(agent), cwd })

  if (!command)
    return

  if (debug) {
    console.log(command)
    return
  }

  await execaCommand(command, { stdio: 'inherit', encoding: 'utf-8', cwd })
}

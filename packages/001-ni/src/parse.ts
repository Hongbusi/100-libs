import type { Runner } from './runner'

export const parseNi: Runner = (agent, args, ctx) => {
  return 'pnpm install'
}

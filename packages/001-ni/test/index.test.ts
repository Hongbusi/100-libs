import { expect, test } from 'vitest'
import { parseNi } from '../src/parse'

const agent = 'pnpm'
// eslint-disable-next-line antfu/top-level-function
const _ = (arg: string, expected: string) => () => {
  expect(parseNi(agent, arg.split(' ').filter(Boolean))).toBe(expected)
}

test('empty', _('', 'pnpm install'))

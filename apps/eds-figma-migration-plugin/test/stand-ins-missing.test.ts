/**
 * A rule that names a target missing from the EDS Beta (the MISSING_NOTE path
 * in rules.ts, finalise): the value is No equivalent with the stand-in for
 * its kind, and the reason keeps the note the inventory tests fail on. The
 * inventory is mocked here, with two variables hidden, since the rules name
 * no missing target against the inventory the plugin ships with.
 */
import { describe, expect, it, vi } from 'vitest'
import type { NewVariable } from '../src/mapping/inventory'
import { resolveVariable } from '../src/mapping/rules'
import { concept, ctx, density } from './helpers'

vi.mock('../src/mapping/inventory', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../src/mapping/inventory')>()
  const hidden = new Set(['background/floating', 'spacing/md'])
  return {
    ...actual,
    NEW_VARIABLES: actual.NEW_VARIABLES.filter(
      (variable: NewVariable) => !hidden.has(variable.name),
    ),
    getNewVariable: (name: string) =>
      hidden.has(name) ? undefined : actual.getNewVariable(name),
  }
})

describe('a proposed target missing from the EDS Beta', () => {
  it('gives a colour the nearest colour for its role instead', () => {
    const result = resolveVariable({
      kind: 'fill',
      variable: { ...concept('Bg/Floating'), colour: '#ffffff' },
      context: ctx(['Menu']),
    })
    expect(result).toMatchObject({
      outcome: 'none',
      rule: 'colour/nearest-by-role',
    })
    expect(result.candidates[0]).toMatch(/^background\//)
    expect(result.candidates).not.toContain('background/floating')
    expect(result.reason).toMatch(
      /^Bg\/Floating; background\/floating is not in EDS Foundation; the stand-in is/,
    )
  })

  it('gives a number the px without a variable when no other token has it', () => {
    const result = resolveVariable({
      kind: 'spacing',
      variable: { ...density('spacing/horizontal/md'), value: 16 },
      context: ctx(['Card']),
    })
    expect(result).toMatchObject({
      outcome: 'none',
      candidates: ['value:16'],
      rule: 'number/as-px',
    })
    expect(result.reason).toMatch(/spacing\/md is not in EDS Foundation/)
  })
})

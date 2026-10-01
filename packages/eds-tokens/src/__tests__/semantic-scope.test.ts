import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

/**
 * Regression test for #5226 and #5247.
 *
 * A CSS custom property resolves its var() references on the element that
 * declares it, and descendants inherit the result. A token that refers to
 * something a subtree can change must therefore be declared again on every
 * element that changes it, or the subtree inherits the value resolved at the
 * root. `--eds-spacing-md` stayed 16px inside `data-density="compact"` for
 * exactly this reason. For the committed bundle that means:
 *
 * - a block that refers to a colour-scheme alias must also match
 *   `[data-color-scheme]` (#5226)
 * - a block that refers to a density token must also match `[data-density]`,
 *   and the density base must also match `[data-density="comfortable"]`, so
 *   Comfortable can be asked for inside a Compact subtree (#5247)
 * - the density layer itself must not be widened any further, or every element
 *   with a colour scheme resets its subtree to Comfortable (#5239)
 *
 * The names are read from the bundle rather than listed here, so a token added
 * upstream is covered without touching this file. These are structural checks
 * on the committed artifact; widen-semantic-scope.mjs and the assertions in
 * generate-css-bundle.mjs guard the generate path.
 */

const bundle = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../tokens/css/variables.css',
)

type Block = {
  selectors: string[]
  declared: Map<string, string>
  referenced: Set<string>
}

// Known exception: the elevation layer (`--eds-shadow-*`) is declared on
// `:root` only, but its colours refer to these two aliases, which are set per
// colour scheme. It resolves once at the root, so a subtree with another scheme
// keeps the root's shadow colour. That is invisible while both schemes give the
// same values, so the exception is only allowed while they do (see the test
// below). Tracked in #5567; remove this once the elevation layer is widened.
const ELEVATION_ALIASES = ['--eds-elevation-key', '--eds-elevation-ambient']

const css = fs.readFileSync(bundle, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')

const blocks: Block[] = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(
  ([, selector, body]) => ({
    selectors: selector.split(',').map((part) => part.trim()),
    declared: new Map(
      [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)].map((match) => [
        match[1],
        match[2].trim(),
      ]),
    ),
    referenced: new Set(
      [...body.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]),
    ),
  }),
)

const isSchemeBlock = (block: Block) =>
  block.selectors.some((selector) =>
    /^\[data-color-scheme="(light|dark)"\]$/.test(selector),
  )
const isDensityBlock = (block: Block) =>
  [...block.declared.keys()].some((name) => name.startsWith('--eds-density-'))

const schemeBlocks = blocks.filter(isSchemeBlock)
const densityBlocks = blocks.filter(isDensityBlock)
const namesIn = (group: Block[]) =>
  new Set(group.flatMap((block) => [...block.declared.keys()]))
const schemeNames = namesIn(schemeBlocks)
const densityNames = namesIn(densityBlocks)

const referencesTo = (block: Block, names: Set<string>) =>
  [...block.referenced].filter((name) => names.has(name))
const refersTo = (block: Block, names: Set<string>) =>
  referencesTo(block, names).length > 0
const refersOnlyToElevationAliases = (block: Block) =>
  referencesTo(block, schemeNames).every((name) =>
    ELEVATION_ALIASES.includes(name),
  )

describe('subtree scoping in the Tokens Studio CSS bundle', () => {
  it('has only flat rules, which the block parser relies on', () => {
    expect(css).not.toMatch(/@[\w-]+/)
  })

  it('has one block per colour scheme and one per density', () => {
    expect(schemeBlocks).toHaveLength(2)
    expect(densityBlocks.map((block) => block.selectors)).toEqual([
      [':root', '[data-density="comfortable"]'],
      ['[data-density="compact"]'],
      ['[data-density="relaxed"]'],
    ])
  })

  describe('colour scheme (#5226)', () => {
    const dependents = blocks.filter(
      (block) => !isSchemeBlock(block) && refersTo(block, schemeNames),
    )

    it('has blocks that refer to the colour-scheme aliases', () => {
      expect(dependents.length).toBeGreaterThan(0)
    })

    it('declares every such block on [data-color-scheme] too', () => {
      for (const block of dependents) {
        if (refersOnlyToElevationAliases(block)) continue
        expect(block.selectors).toContain('[data-color-scheme]')
      }
    })

    it('only exempts the elevation layer while both schemes agree on it', () => {
      const [light, dark] = ['light', 'dark'].map((scheme) =>
        schemeBlocks.find((block) =>
          block.selectors.includes(`[data-color-scheme="${scheme}"]`),
        ),
      )
      for (const name of ELEVATION_ALIASES) {
        expect(dark?.declared.get(name), name).toBe(light?.declared.get(name))
      }
    })
  })

  describe('density (#5247)', () => {
    const dependents = blocks.filter(
      (block) => !isDensityBlock(block) && refersTo(block, densityNames),
    )

    it('has blocks that refer to the density tokens', () => {
      expect(dependents.length).toBeGreaterThan(0)
    })

    it('declares every such block on [data-density] too', () => {
      for (const block of dependents) {
        expect(block.selectors).toContain('[data-density]')
      }
    })

    it('does not widen the density layer to [data-color-scheme] (#5239)', () => {
      for (const block of densityBlocks) {
        expect(block.selectors).not.toContain('[data-color-scheme]')
        expect(block.selectors).not.toContain('[data-density]')
      }
    })
  })
})

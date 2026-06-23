import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

/**
 * Regression test for #5090.
 *
 * The bug: spacing aliases (--eds-generic-gap-vertical, --eds-selectable-space-
 * vertical, --eds-container-space-vertical, --eds-spacing-proportions-{size}-*,
 * --eds-{selectable,container,page}-gap-*) were declared at `:root` and
 * referenced density-aware primitives. CSS var() resolves at the declaring
 * element, so the spacious value was inherited as a string and never
 * re-resolved when a descendant got data-density="comfortable".
 *
 * The fix re-emits each bare alias with the resolved value inside the
 * [data-density="comfortable"] / [data-density="spacious"] blocks. This test
 * guards against the bare aliases silently disappearing from those blocks
 * again — a class of cascade bug that type-level tests can't catch and that
 * was only visible at runtime in the browser.
 */

const cssDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../build/css/spacing',
)

const readDensity = (mode: 'comfortable' | 'spacious') =>
  fs.readFileSync(path.join(cssDir, `${mode}.css`), 'utf-8')

// Match `--<token>:<value>rem;` and return the value as a normalised number
// (handles both `0.375rem` and `.375rem` formats that the CSS formatter may emit).
const tokenValue = (text: string, token: string): number | null => {
  const match = new RegExp(`--${token}:\\s*([\\d]*\\.?[\\d]+)rem;`).exec(text)
  return match ? parseFloat(match[1]) : null
}

const toRem = (raw: string): number => parseFloat(raw.replace(/rem$/, ''))

describe('density-aware spacing aliases (#5090)', () => {
  describe('comfortable.css', () => {
    const css = readDensity('comfortable')

    it.each([
      ['eds-generic-gap-vertical', '.375rem'],
      ['eds-generic-gap-horizontal', '.375rem'],
      ['eds-generic-space-vertical', '.375rem'],
      ['eds-selectable-space-vertical', '.375rem'],
      ['eds-selectable-space-horizontal', '.375rem'],
      ['eds-container-space-vertical', '.75rem'],
      ['eds-container-space-horizontal', '.75rem'],
      ['eds-page-space-vertical', '1.25rem'],
      ['eds-spacing-proportions-xs-vertical', '.375rem'],
      ['eds-spacing-proportions-md-vertical', '.75rem'],
      ['eds-spacing-proportions-xl-vertical', '1.25rem'],
      ['eds-selectable-gap-vertical', '.375rem'],
      ['eds-container-gap-vertical', '.75rem'],
      ['eds-page-gap-vertical', '1.25rem'],
    ])('declares --%s with comfortable value %s', (token, expected) => {
      const value = tokenValue(css, token)
      expect(value, `--${token} not declared in comfortable.css`).not.toBeNull()
      expect(value).toBeCloseTo(toRem(expected), 5)
    })

    it('declares aliases inside the [data-density="comfortable"] selector block', () => {
      // Ensure the aliases sit inside the density block, not a stray :root.
      const blockMatch = /\[data-density="comfortable"\]\s*\{([^}]*)\}/.exec(
        css,
      )
      expect(blockMatch).not.toBeNull()
      const block = blockMatch![1]
      expect(block).toMatch(/--eds-generic-gap-vertical:/)
      expect(block).toMatch(/--eds-container-space-vertical:/)
      expect(block).toMatch(/--eds-spacing-proportions-md-vertical:/)
    })
  })

  describe('spacious.css', () => {
    const css = readDensity('spacious')

    it.each([
      ['eds-generic-gap-vertical', '.5rem'],
      ['eds-selectable-space-vertical', '.5rem'],
      ['eds-container-space-vertical', '1rem'],
      ['eds-spacing-proportions-md-vertical', '1rem'],
      ['eds-page-space-vertical', '1.5rem'],
      ['eds-selectable-gap-vertical', '.5rem'],
      ['eds-container-gap-vertical', '1rem'],
      ['eds-page-gap-vertical', '1.5rem'],
    ])('declares --%s with spacious value %s', (token, expected) => {
      const value = tokenValue(css, token)
      expect(value, `--${token} not declared in spacious.css`).not.toBeNull()
      expect(value).toBeCloseTo(toRem(expected), 5)
    })

    it('declares aliases under :root, [data-density="spacious"]', () => {
      expect(css).toMatch(
        /:root,\s*\[data-density="spacious"\]\s*\{[\s\S]*--eds-generic-gap-vertical:/,
      )
    })
  })

  describe('comfortable vs spacious values differ', () => {
    // The whole point: each alias must hold a different value across the two
    // density blocks. If they accidentally end up equal, density isn't
    // propagating.
    const comfortable = readDensity('comfortable')
    const spacious = readDensity('spacious')

    it.each([
      'eds-generic-gap-vertical',
      'eds-selectable-space-vertical',
      'eds-container-space-vertical',
      'eds-spacing-proportions-md-vertical',
      'eds-page-space-vertical',
    ])('--%s has different value in comfortable vs spacious', (token) => {
      const c = tokenValue(comfortable, token)
      const s = tokenValue(spacious, token)
      expect(c, `--${token} missing from comfortable.css`).not.toBeNull()
      expect(s, `--${token} missing from spacious.css`).not.toBeNull()
      expect(c).not.toBe(s)
    })
  })
})

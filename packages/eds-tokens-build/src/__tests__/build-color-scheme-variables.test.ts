import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Color Scheme Variables Build', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should build CSS color scheme variables from tokens', () => {
    // Run full pipeline up to color scheme variables
    runScripts(
      [
        'generate-color-scheme-tokens.js',
        'generate-concept-tokens.js',
        'generate-semantic-tokens.js',
        'generate-dynamic-appearance-tokens.js',
        'build-color-scheme-variables.js',
      ],
      testWorkspace,
    )

    // Verify color scheme CSS was generated
    const colorSchemeCSS = path.join(
      testWorkspace,
      'build/css/color/color-scheme/color-scheme.css',
    )
    expect(existsSync(colorSchemeCSS)).toBe(true)

    // Snapshot test the generated CSS
    const actualColorScheme = readFileSync(colorSchemeCSS, 'utf-8')
    expect(actualColorScheme).toMatchSnapshot('color-scheme.css')
  })
})

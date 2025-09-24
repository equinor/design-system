import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Semantic Dynamic Variables Build', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should build CSS dynamic variables from semantic tokens', () => {
    // Run full pipeline up to dynamic variables
    runScripts(
      [
        'generate-color-scheme-tokens.js',
        'generate-concept-tokens.js',
        'generate-semantic-tokens.js',
        'generate-dynamic-appearance-tokens.js',
        'build-color-scheme-variables.js',
        'build-semantic-static-variables.js',
        'build-semantic-dynamic-variables.js',
      ],
      testWorkspace,
    )

    // Verify dynamic CSS was generated
    const dynamicCSS = path.join(
      testWorkspace,
      'build/css/color/dynamic/variables.css',
    )
    expect(existsSync(dynamicCSS)).toBe(true)

    // Snapshot test the generated CSS
    const actualDynamic = readFileSync(dynamicCSS, 'utf-8')
    expect(actualDynamic).toMatchSnapshot('dynamic-variables.css')
  })
})

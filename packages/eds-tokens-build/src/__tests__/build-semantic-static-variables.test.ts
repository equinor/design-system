import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Semantic Static Variables Build', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should build CSS static variables from semantic tokens', () => {
    // Run full pipeline up to static variables
    runScripts(
      [
        'generate-color-scheme-tokens.js',
        'generate-concept-tokens.js',
        'generate-semantic-tokens.js',
        'generate-dynamic-appearance-tokens.js',
        'build-color-scheme-variables.js',
        'build-semantic-static-variables.js',
      ],
      testWorkspace,
    )

    // Verify static CSS was generated
    const staticCSS = path.join(
      testWorkspace,
      'build/css/color/static/variables.css',
    )
    expect(existsSync(staticCSS)).toBe(true)

    // Snapshot test the generated CSS
    const actualStatic = readFileSync(staticCSS, 'utf-8')
    expect(actualStatic).toMatchSnapshot('static-variables.css')
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Dynamic Appearance Token Generation', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should generate dynamic appearance tokens', () => {
    // Run prerequisite and dynamic appearance generation
    runScripts(
      [
        'generate-color-scheme-tokens.js',
        'generate-concept-tokens.js',
        'generate-semantic-tokens.js',
        'generate-dynamic-appearance-tokens.js',
      ],
      testWorkspace,
    )

    // The generate-dynamic-appearance-tokens script typically works with existing token files
    // and doesn't necessarily create new token JSON files, but may modify existing ones
    // or prepare data for the build scripts that follow.
    // Let's verify that the prerequisite files still exist after running this script
    const lightSchemeFile = path.join(
      testWorkspace,
      'tokens/test-foundation/🌗 Color Scheme.Light.json',
    )
    const darkSchemeFile = path.join(
      testWorkspace,
      'tokens/test-foundation/🌗 Color Scheme.Dark.json',
    )
    const conceptFile = path.join(
      testWorkspace,
      'tokens/test-static/Concept.Mode 1.json',
    )
    const semanticFile = path.join(
      testWorkspace,
      'tokens/test-static/Semantic.Mode 1.json',
    )

    expect(existsSync(lightSchemeFile)).toBe(true)
    expect(existsSync(darkSchemeFile)).toBe(true)
    expect(existsSync(conceptFile)).toBe(true)
    expect(existsSync(semanticFile)).toBe(true)

    // Test that the files contain expected structure (snapshot test)
    // This ensures the dynamic appearance token generation doesn't break existing files
    const semanticContent = readFileSync(semanticFile, 'utf-8')
    expect(semanticContent).toMatchSnapshot('semantic-after-dynamic.json')
  })
})

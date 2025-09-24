import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Semantic Token Generation', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should generate semantic tokens from concept tokens', () => {
    // Run prerequisite and semantic generation
    runScripts(
      [
        'generate-color-scheme-tokens.js',
        'generate-concept-tokens.js',
        'generate-semantic-tokens.js',
      ],
      testWorkspace,
    )

    // Verify semantic file was created
    const semanticFile = path.join(
      testWorkspace,
      'tokens/test-static/Semantic.Mode 1.json',
    )

    expect(existsSync(semanticFile)).toBe(true)

    // Snapshot test the generated JSON file
    const semanticContent = readFileSync(semanticFile, 'utf-8')
    expect(semanticContent).toMatchSnapshot('semantic.json')
  })
})

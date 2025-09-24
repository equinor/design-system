import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScripts,
} from './test-utils'

describe('Concept Token Generation', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should generate concept tokens from color scheme tokens', () => {
    // Run prerequisite and concept generation
    runScripts(
      ['generate-color-scheme-tokens.js', 'generate-concept-tokens.js'],
      testWorkspace,
    )

    // Verify concept file was created
    const conceptFile = path.join(
      testWorkspace,
      'tokens/test-static/Concept.Mode 1.json',
    )

    expect(existsSync(conceptFile)).toBe(true)

    // Snapshot test the generated JSON file
    const conceptContent = readFileSync(conceptFile, 'utf-8')
    expect(conceptContent).toMatchSnapshot('concept.json')
  })
})

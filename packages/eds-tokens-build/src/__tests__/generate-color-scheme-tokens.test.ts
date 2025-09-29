import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, existsSync, rmSync } from 'fs'
import path from 'path'
import {
  setupTestWorkspace,
  cleanupTestWorkspace,
  runScript,
  getScriptPath,
} from './test-utils'
import { execSync } from 'child_process'

describe('Color Scheme Token Generation', () => {
  let testWorkspace: string

  beforeEach(() => {
    testWorkspace = setupTestWorkspace()
  })

  afterEach(() => {
    cleanupTestWorkspace(testWorkspace)
  })

  it('should generate light and dark color scheme tokens from foundation colors', () => {
    // Generate color scheme tokens
    runScript('generate-color-scheme-tokens.js', testWorkspace)

    // Verify scheme files were created
    const lightSchemeFile = path.join(
      testWorkspace,
      'tokens/test-foundation/🌗 Color Scheme.Light.json',
    )
    const darkSchemeFile = path.join(
      testWorkspace,
      'tokens/test-foundation/🌗 Color Scheme.Dark.json',
    )

    expect(existsSync(lightSchemeFile)).toBe(true)
    expect(existsSync(darkSchemeFile)).toBe(true)

    // Snapshot test the generated JSON files
    const lightSchemeContent = readFileSync(lightSchemeFile, 'utf-8')
    const darkSchemeContent = readFileSync(darkSchemeFile, 'utf-8')

    expect(lightSchemeContent).toMatchSnapshot('color-scheme-light.json')
    expect(darkSchemeContent).toMatchSnapshot('color-scheme-dark.json')
  })

  it('should handle missing configuration file gracefully', () => {
    // Check if config file exists, then remove it
    const configPath = path.join(testWorkspace, 'token-config.json')
    if (existsSync(configPath)) {
      rmSync(configPath)
    }

    const scriptPath = getScriptPath('generate-color-scheme-tokens.js')

    expect(() => {
      execSync(`node "${scriptPath}"`, {
        stdio: 'pipe',
        cwd: testWorkspace,
      })
    }).toThrow()
  })
})

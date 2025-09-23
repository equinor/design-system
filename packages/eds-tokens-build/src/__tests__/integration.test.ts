import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Token Build Pipeline Snapshots', () => {
  const testWorkspace = path.resolve(__dirname, '../test-workspace')

  beforeEach(() => {
    // Clean and setup test workspace
    if (existsSync(testWorkspace)) {
      rmSync(testWorkspace, { recursive: true, force: true })
    }

    // Create workspace structure
    mkdirSync(testWorkspace, { recursive: true })
    mkdirSync(path.join(testWorkspace, 'tokens'), { recursive: true })
    mkdirSync(path.join(testWorkspace, 'build'), { recursive: true })

    // Copy fixtures to workspace
    const fixturesPath = path.resolve(__dirname, 'fixtures')
    execSync(`cp -r "${fixturesPath}/"* "${testWorkspace}/"`)
  })

  afterEach(() => {
    // Clean up
    if (existsSync(testWorkspace)) {
      rmSync(testWorkspace, { recursive: true, force: true })
    }
  })

  /**
   * Runs the full token generation and build pipeline
   */
  const runFullPipeline = () => {
    const scripts = [
      'generate-color-scheme-tokens.js',
      'generate-concept-tokens.js',
      'generate-semantic-tokens.js',
      'generate-dynamic-appearance-tokens.js',
      'build-color-scheme-variables.js',
      'build-semantic-static-variables.js',
      'build-semantic-dynamic-variables.js',
    ]

    for (const script of scripts) {
      const scriptPath = path.resolve(__dirname, `../../dist/scripts/${script}`)
      execSync(`node "${scriptPath}"`, {
        stdio: 'pipe',
        cwd: testWorkspace,
      })
    }
  }

  it('should generate color scheme tokens matching expected snapshots', () => {
    // Step 1: Generate color scheme tokens from foundation colors
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    execSync(`node "${generateCmd}"`, {
      stdio: 'pipe',
      cwd: testWorkspace,
    })

    // Verify scheme files were created and match snapshots
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

  it('should generate concept tokens matching expected snapshots', () => {
    // Run prerequisite steps
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    const conceptCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-concept-tokens.js',
    )

    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${conceptCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Verify concept file was created and matches snapshot
    const conceptFile = path.join(
      testWorkspace,
      'tokens/test-static/Concept.Mode 1.json',
    )

    expect(existsSync(conceptFile)).toBe(true)

    const conceptContent = readFileSync(conceptFile, 'utf-8')
    expect(conceptContent).toMatchSnapshot('concept.json')
  })

  it('should generate semantic tokens matching expected snapshots', () => {
    // Run full pipeline up to semantic generation
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    const conceptCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-concept-tokens.js',
    )
    const semanticCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-semantic-tokens.js',
    )

    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${conceptCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${semanticCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Verify semantic file was created and matches snapshot
    const semanticFile = path.join(
      testWorkspace,
      'tokens/test-static/Semantic.Mode 1.json',
    )

    expect(existsSync(semanticFile)).toBe(true)

    const semanticContent = readFileSync(semanticFile, 'utf-8')
    expect(semanticContent).toMatchSnapshot('semantic.json')
  })

  it('should build color scheme variables matching expected snapshots', () => {
    runFullPipeline()

    // Verify color scheme CSS was generated and matches snapshot
    const colorSchemeCSS = path.join(
      testWorkspace,
      'build/css/color/color-scheme/color-scheme.css',
    )
    expect(existsSync(colorSchemeCSS)).toBe(true)

    const actualColorScheme = readFileSync(colorSchemeCSS, 'utf-8')
    expect(actualColorScheme).toMatchSnapshot('color-scheme.css')
  })

  it('should build semantic static variables matching expected snapshots', () => {
    runFullPipeline()

    // Verify static CSS was generated and matches snapshot
    const staticCSS = path.join(
      testWorkspace,
      'build/css/color/static/variables.css',
    )
    expect(existsSync(staticCSS)).toBe(true)

    const actualStatic = readFileSync(staticCSS, 'utf-8')
    expect(actualStatic).toMatchSnapshot('static-variables.css')
  })

  it('should build dynamic appearance variables matching expected snapshots', () => {
    runFullPipeline()

    // Verify dynamic CSS was generated and matches snapshot
    const dynamicCSS = path.join(
      testWorkspace,
      'build/css/color/dynamic/variables.css',
    )
    expect(existsSync(dynamicCSS)).toBe(true)

    const actualDynamic = readFileSync(dynamicCSS, 'utf-8')
    expect(actualDynamic).toMatchSnapshot('dynamic-variables.css')
  })

  it('should handle missing configuration gracefully', () => {
    // Remove the config file to test error handling
    rmSync(path.join(testWorkspace, 'token-config.json'))

    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )

    expect(() => {
      execSync(`node "${generateCmd}"`, {
        stdio: 'pipe',
        cwd: testWorkspace,
      })
    }).toThrow()
  })
})

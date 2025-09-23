import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('Token Build Pipeline Integration', () => {
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

  it('should generate color scheme tokens and build variables pipeline', () => {
    // Step 1: Generate color scheme tokens from foundation colors
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    expect(() => {
      execSync(`node "${generateCmd}"`, {
        stdio: 'pipe',
        cwd: testWorkspace,
      })
    }).not.toThrow()

    // Verify scheme files were created from foundation colors
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

    // Step 2: Generate concept tokens
    const conceptCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-concept-tokens.js',
    )
    execSync(`node "${conceptCmd}"`, {
      stdio: 'pipe',
      cwd: testWorkspace,
    })

    // Step 3: Generate semantic tokens
    const semanticCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-semantic-tokens.js',
    )
    execSync(`node "${semanticCmd}"`, {
      stdio: 'pipe',
      cwd: testWorkspace,
    })

    // Step 4: Build color scheme variables (foundation → CSS)
    const colorSchemeCmd = path.resolve(
      __dirname,
      '../../dist/scripts/build-color-scheme-variables.js',
    )
    execSync(`node "${colorSchemeCmd}"`, {
      stdio: 'pipe',
      cwd: testWorkspace,
    })

    // Verify color scheme CSS was generated and matches expected
    const colorSchemeCSS = path.join(
      testWorkspace,
      'build/css/color/color-scheme/color-scheme.css',
    )
    expect(existsSync(colorSchemeCSS)).toBe(true)

    const actualColorScheme = readFileSync(colorSchemeCSS, 'utf-8').trim()
    const expectedColorScheme = readFileSync(
      path.resolve(__dirname, 'expected/color-scheme.css'),
      'utf-8',
    ).trim()

    const normalizeCSS = (css: string) =>
      css.replace(/\s+/g, ' ').replace(/;\s*}/g, ';}').trim()

    expect(normalizeCSS(actualColorScheme)).toBe(
      normalizeCSS(expectedColorScheme),
    )
  })

  it('should generate semantic static variables matching expected output', () => {
    // Run the full pipeline
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
    const staticCmd = path.resolve(
      __dirname,
      '../../dist/scripts/build-semantic-static-variables.js',
    )

    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${conceptCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${semanticCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${staticCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Verify static CSS was generated and matches expected
    const staticCSS = path.join(
      testWorkspace,
      'build/css/color/static/variables.css',
    )
    expect(existsSync(staticCSS)).toBe(true)

    const actualStatic = readFileSync(staticCSS, 'utf-8').trim()
    const expectedStatic = readFileSync(
      path.resolve(__dirname, 'expected/static-variables.css'),
      'utf-8',
    ).trim()

    const normalizeCSS = (css: string) =>
      css.replace(/\s+/g, ' ').replace(/;\s*}/g, ';}').trim()

    expect(normalizeCSS(actualStatic)).toBe(normalizeCSS(expectedStatic))
  })

  it('should generate dynamic appearance variables matching expected output', () => {
    // Run the full pipeline
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
    const dynamicGenerateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-dynamic-appearance-tokens.js',
    )
    const dynamicCmd = path.resolve(
      __dirname,
      '../../dist/scripts/build-semantic-dynamic-variables.js',
    )

    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${conceptCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${semanticCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${dynamicGenerateCmd}"`, {
      stdio: 'pipe',
      cwd: testWorkspace,
    })
    execSync(`node "${dynamicCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Verify dynamic CSS was generated and matches expected
    const dynamicCSS = path.join(
      testWorkspace,
      'build/css/color/dynamic/variables.css',
    )
    expect(existsSync(dynamicCSS)).toBe(true)

    const actualDynamic = readFileSync(dynamicCSS, 'utf-8').trim()
    const expectedDynamic = readFileSync(
      path.resolve(__dirname, 'expected/dynamic-variables.css'),
      'utf-8',
    ).trim()

    const normalizeCSS = (css: string) =>
      css.replace(/\s+/g, ' ').replace(/;\s*}/g, ';}').trim()

    expect(normalizeCSS(actualDynamic)).toBe(normalizeCSS(expectedDynamic))
  })

  it('should validate token structure and references', () => {
    // Generate tokens
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Read and validate token structure
    const lightScheme = JSON.parse(
      readFileSync(
        path.join(
          testWorkspace,
          'tokens/test-foundation/🌗 Color Scheme.Light.json',
        ),
        'utf-8',
      ),
    )
    const darkScheme = JSON.parse(
      readFileSync(
        path.join(
          testWorkspace,
          'tokens/test-foundation/🌗 Color Scheme.Dark.json',
        ),
        'utf-8',
      ),
    )

    // Validate that tokens have correct structure
    expect(lightScheme.Brand).toBeDefined()
    expect(darkScheme.Brand).toBeDefined()

    // Validate that foundation colors are properly referenced
    const lightColors = lightScheme
    const darkColors = darkScheme

    // Check brand colors exist
    expect(lightColors.Brand['1']).toBeDefined()
    expect(darkColors.Brand['1']).toBeDefined()

    // Validate color values are proper references
    expect(lightColors.Brand['7'].$value).toBe('{Light.Brand.7}')
    expect(darkColors.Brand['7'].$value).toBe('{Dark.Brand.7}')
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

  it('should generate JSON and JS outputs alongside CSS', () => {
    // Run pipeline to generate color scheme files
    const generateCmd = path.resolve(
      __dirname,
      '../../dist/scripts/generate-color-scheme-tokens.js',
    )
    const colorSchemeCmd = path.resolve(
      __dirname,
      '../../dist/scripts/build-color-scheme-variables.js',
    )

    execSync(`node "${generateCmd}"`, { stdio: 'pipe', cwd: testWorkspace })
    execSync(`node "${colorSchemeCmd}"`, { stdio: 'pipe', cwd: testWorkspace })

    // Verify multiple output formats were generated
    const cssFile = path.join(
      testWorkspace,
      'build/css/color/color-scheme/color-scheme.css',
    )
    const jsonFile = path.join(
      testWorkspace,
      'build/json/color/color-scheme/nested/light-color-scheme.json',
    )
    const jsonFlat = path.join(
      testWorkspace,
      'build/json/color/color-scheme/flat/light-color-scheme.json',
    )
    const jsFile = path.join(
      testWorkspace,
      'build/js/color/color-scheme/light-color-scheme.js',
    )

    expect(existsSync(cssFile)).toBe(true)
    expect(existsSync(jsonFile)).toBe(true)
    expect(existsSync(jsonFlat)).toBe(true)
    expect(existsSync(jsFile)).toBe(true)

    // Validate JSON structure
    const jsonContent = JSON.parse(readFileSync(jsonFile, 'utf-8'))
    expect(jsonContent.Brand).toBeDefined()
    expect(jsonContent.Brand['1']).toBeDefined()
  })
})

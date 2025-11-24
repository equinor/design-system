import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execFileSync } from 'node:child_process'

describe('generate-colors CLI', () => {
  const testDir = resolve(__dirname, '__test-output__')
  const configPath = resolve(__dirname, '__test-palette-config.json')
  const cliPath = resolve(__dirname, '../../dist/cli/generate-colors.js')

  const testConfig = {
    colors: [
      { name: 'Moss Green', value: '#007079' },
      { name: 'Gray', value: '#4A4A4A' },
      { name: 'Blue', value: '#0084C4' },
    ],
  }

  beforeAll(() => {
    // Create test config
    mkdirSync(testDir, { recursive: true })
    writeFileSync(configPath, JSON.stringify(testConfig, null, 2), 'utf-8')
  })

  afterAll(() => {
    // Clean up
    rmSync(testDir, { recursive: true, force: true })
    rmSync(configPath, { force: true })
  })

  it('should generate light and dark color tokens with default HEX format', () => {
    // Run the CLI
    execFileSync('node', [cliPath, configPath, testDir])

    // Check that files were created with new default names
    const lightTokensPath = join(testDir, 'Color Light.Mode 1.json')
    const darkTokensPath = join(testDir, 'Color Dark.Mode 1.json')

    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))
    const darkTokens = JSON.parse(readFileSync(darkTokensPath, 'utf-8'))

    // Verify structure
    expect(lightTokens).toHaveProperty('Light')
    expect(darkTokens).toHaveProperty('Dark')

    // Verify colors are present
    expect(lightTokens.Light).toHaveProperty('Moss Green')
    expect(lightTokens.Light).toHaveProperty('Gray')
    expect(lightTokens.Light).toHaveProperty('Blue')

    expect(darkTokens.Dark).toHaveProperty('Moss Green')
    expect(darkTokens.Dark).toHaveProperty('Gray')
    expect(darkTokens.Dark).toHaveProperty('Blue')

    // Check HEX format (default)
    const token = lightTokens.Light['Moss Green']['1']
    expect(token.$value).toMatch(/^#[0-9a-f]{6}$/i)

    // Snapshot test
    expect(lightTokens).toMatchSnapshot('light-hex')
    expect(darkTokens).toMatchSnapshot('dark-hex')
  })

  it('should generate tokens with OKLCH format when specified', () => {
    const oklchConfig = {
      colors: [
        { name: 'Moss Green', value: '#007079' },
        { name: 'Blue', value: '#0084C4' },
      ],
      colorFormat: 'OKLCH',
    }

    const oklchConfigPath = resolve(__dirname, '__test-oklch-config.json')
    writeFileSync(
      oklchConfigPath,
      JSON.stringify(oklchConfig, null, 2),
      'utf-8',
    )

    const oklchTestDir = resolve(__dirname, '__test-oklch-output__')
    mkdirSync(oklchTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, oklchConfigPath, oklchTestDir])

    const lightTokensPath = join(oklchTestDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Check OKLCH format
    const token = lightTokens.Light['Moss Green']['1']
    expect(token.$value).toMatch(/oklch\([0-9.]+\s+[0-9.]+\s+[0-9.]+\)/)

    // Snapshot test for OKLCH format
    expect(lightTokens).toMatchSnapshot('light-oklch')

    // Clean up
    rmSync(oklchTestDir, { recursive: true, force: true })
    rmSync(oklchConfigPath, { force: true })
  })

  it('should use custom gaussian parameters if provided', () => {
    const customConfig = {
      colors: [{ name: 'Test Color', value: '#FF0000' }],
      meanLight: 0.5,
      stdDevLight: 1.5,
      meanDark: 0.8,
      stdDevDark: 1.8,
    }

    const customConfigPath = resolve(
      __dirname,
      '__test-custom-palette-config.json',
    )
    writeFileSync(
      customConfigPath,
      JSON.stringify(customConfig, null, 2),
      'utf-8',
    )

    const customTestDir = resolve(__dirname, '__test-custom-output__')
    mkdirSync(customTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, customConfigPath, customTestDir])

    const lightTokensPath = join(customTestDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    expect(lightTokens).toHaveProperty('Light')
    expect(lightTokens.Light).toHaveProperty('Test Color')

    // Snapshot test for custom params
    expect(lightTokens).toMatchSnapshot('custom-params')

    // Clean up
    rmSync(customTestDir, { recursive: true, force: true })
    rmSync(customConfigPath, { force: true })
  })

  it('should use custom output file names when specified', () => {
    const customFileConfig = {
      colors: [{ name: 'Test Color', value: '#0084C4' }],
      outputFileLight: 'custom-light.json',
      outputFileDark: 'custom-dark.json',
    }

    const customFileConfigPath = resolve(
      __dirname,
      '__test-custom-file-config.json',
    )
    writeFileSync(
      customFileConfigPath,
      JSON.stringify(customFileConfig, null, 2),
      'utf-8',
    )

    const customFileTestDir = resolve(__dirname, '__test-custom-file-output__')
    mkdirSync(customFileTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, customFileConfigPath, customFileTestDir])

    // Check that custom file names were used
    const lightTokensPath = join(customFileTestDir, 'custom-light.json')
    const darkTokensPath = join(customFileTestDir, 'custom-dark.json')

    expect(readFileSync(lightTokensPath, 'utf-8')).toBeTruthy()
    expect(readFileSync(darkTokensPath, 'utf-8')).toBeTruthy()

    // Clean up
    rmSync(customFileTestDir, { recursive: true, force: true })
    rmSync(customFileConfigPath, { force: true })
  })

  it('should generate tokens with correct structure', () => {
    const lightTokensPath = join(testDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Check token structure for one color
    const mossGreen = lightTokens.Light['Moss Green']
    expect(mossGreen).toBeDefined()

    // Check that all expected step IDs are present (1-15)
    expect(mossGreen).toHaveProperty('1')
    expect(mossGreen).toHaveProperty('2')
    expect(mossGreen).toHaveProperty('15')

    // Check token format
    const token = mossGreen['1']
    expect(token).toHaveProperty('$type', 'color')
    expect(token).toHaveProperty('$value')
    expect(token).toHaveProperty('$description')
    expect(token).toHaveProperty('$extensions')

    // Check HEX format (default)
    expect(token.$value).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('should convert OKLCH input colors to HEX format when colorFormat is HEX', () => {
    const oklchInputConfig = {
      colors: [
        { name: 'Moss Green', value: 'oklch(0.4973 0.084851 204.553)' },
        { name: 'Gray', value: 'oklch(0.4091 0 0)' },
        { name: 'Blue', value: 'oklch(0.5857 0.135751 240.6802)' },
      ],
      colorFormat: 'HEX',
    }

    const oklchInputConfigPath = resolve(
      __dirname,
      '__test-oklch-input-config.json',
    )
    writeFileSync(
      oklchInputConfigPath,
      JSON.stringify(oklchInputConfig, null, 2),
      'utf-8',
    )

    const oklchInputTestDir = resolve(__dirname, '__test-oklch-input-output__')
    mkdirSync(oklchInputTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, oklchInputConfigPath, oklchInputTestDir])

    const lightTokensPath = join(oklchInputTestDir, 'Color Light.Mode 1.json')
    const darkTokensPath = join(oklchInputTestDir, 'Color Dark.Mode 1.json')

    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))
    const darkTokens = JSON.parse(readFileSync(darkTokensPath, 'utf-8'))

    // Check that all colors are in HEX format
    Object.keys(lightTokens.Light).forEach((colorName) => {
      Object.keys(lightTokens.Light[colorName]).forEach((stepId) => {
        const token = lightTokens.Light[colorName][stepId]
        expect(token.$value).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    Object.keys(darkTokens.Dark).forEach((colorName) => {
      Object.keys(darkTokens.Dark[colorName]).forEach((stepId) => {
        const token = darkTokens.Dark[colorName][stepId]
        expect(token.$value).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    // Snapshot test for OKLCH input with HEX output
    expect(lightTokens).toMatchSnapshot('oklch-input-hex-output-light')
    expect(darkTokens).toMatchSnapshot('oklch-input-hex-output-dark')

    // Clean up
    rmSync(oklchInputTestDir, { recursive: true, force: true })
    rmSync(oklchInputConfigPath, { force: true })
  })

  it('should generate color scales using anchors (interpolation)', () => {
    const anchorsConfig = {
      colors: [
        {
          name: 'Interpolated Green',
          anchors: [
            { value: 'oklch(0.5915 0.0731 184.63)', step: 6 },
            { value: 'oklch(0.4973 0.084851 204.553)', step: 9 },
          ],
        },
      ],
    }

    const anchorsConfigPath = resolve(__dirname, '__test-anchors-config.json')
    writeFileSync(
      anchorsConfigPath,
      JSON.stringify(anchorsConfig, null, 2),
      'utf-8',
    )

    const anchorsTestDir = resolve(__dirname, '__test-anchors-output__')
    mkdirSync(anchorsTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, anchorsConfigPath, anchorsTestDir])

    const lightTokensPath = join(anchorsTestDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Verify structure
    expect(lightTokens).toHaveProperty('Light')
    expect(lightTokens.Light).toHaveProperty('Interpolated Green')

    // Check that we have 15 steps
    const greenTokens = lightTokens.Light['Interpolated Green']
    expect(Object.keys(greenTokens)).toHaveLength(15)

    // Snapshot test
    expect(lightTokens).toMatchSnapshot('anchors-interpolation-light')

    // Clean up
    rmSync(anchorsTestDir, { recursive: true, force: true })
    rmSync(anchorsConfigPath, { force: true })
  })

  it('should generate color scales using anchors at steps 6 and 9', () => {
    const anchorsConfig = {
      colors: [
        {
          name: 'Mid-Step Anchors',
          anchors: [
            { value: 'oklch(0.5915 0.0731 184.63)', step: 6 },
            { value: 'oklch(0.4973 0.084851 204.553)', step: 9 },
          ],
        },
      ],
    }

    const anchorsConfigPath = resolve(
      __dirname,
      '__test-mid-anchors-config.json',
    )
    writeFileSync(
      anchorsConfigPath,
      JSON.stringify(anchorsConfig, null, 2),
      'utf-8',
    )

    const anchorsTestDir = resolve(__dirname, '__test-mid-anchors-output__')
    mkdirSync(anchorsTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, anchorsConfigPath, anchorsTestDir])

    const lightTokensPath = join(anchorsTestDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Verify structure
    expect(lightTokens).toHaveProperty('Light')
    expect(lightTokens.Light).toHaveProperty('Mid-Step Anchors')

    // Check that we have 15 steps
    const tokens = lightTokens.Light['Mid-Step Anchors']
    expect(Object.keys(tokens)).toHaveLength(15)

    // Snapshot test
    expect(lightTokens).toMatchSnapshot('anchors-mid-steps-light')

    // Clean up
    rmSync(anchorsTestDir, { recursive: true, force: true })
    rmSync(anchorsConfigPath, { force: true })
  })

  it('should handle mixed legacy (value) and new (anchors) color definitions', () => {
    const mixedConfig = {
      colors: [
        { name: 'Legacy Color', value: '#FF0000' },
        {
          name: 'New Color',
          anchors: [
            { value: '#0000FF', step: 1 },
            { value: '#00FFFF', step: 15 },
          ],
        },
      ],
    }

    const mixedConfigPath = resolve(__dirname, '__test-mixed-config.json')
    writeFileSync(
      mixedConfigPath,
      JSON.stringify(mixedConfig, null, 2),
      'utf-8',
    )

    const mixedTestDir = resolve(__dirname, '__test-mixed-output__')
    mkdirSync(mixedTestDir, { recursive: true })

    // Run the CLI
    execFileSync('node', [cliPath, mixedConfigPath, mixedTestDir])

    const lightTokensPath = join(mixedTestDir, 'Color Light.Mode 1.json')
    const lightTokens = JSON.parse(readFileSync(lightTokensPath, 'utf-8'))

    // Verify both colors are present
    expect(lightTokens.Light).toHaveProperty('Legacy Color')
    expect(lightTokens.Light).toHaveProperty('New Color')

    // Both should have 15 steps
    expect(Object.keys(lightTokens.Light['Legacy Color'])).toHaveLength(15)
    expect(Object.keys(lightTokens.Light['New Color'])).toHaveLength(15)

    // Snapshot test
    expect(lightTokens).toMatchSnapshot('mixed-legacy-new-format')

    // Clean up
    rmSync(mixedTestDir, { recursive: true, force: true })
    rmSync(mixedConfigPath, { force: true })
  })

  it('should throw error when color definition has neither value nor anchors', () => {
    const invalidConfig = {
      colors: [{ name: 'Invalid Color' }],
    }

    const invalidConfigPath = resolve(__dirname, '__test-invalid-config.json')
    writeFileSync(
      invalidConfigPath,
      JSON.stringify(invalidConfig, null, 2),
      'utf-8',
    )

    const invalidTestDir = resolve(__dirname, '__test-invalid-output__')
    mkdirSync(invalidTestDir, { recursive: true })

    // Run the CLI and expect it to fail
    expect(() => {
      execFileSync('node', [cliPath, invalidConfigPath, invalidTestDir])
    }).toThrow()

    // Clean up
    rmSync(invalidTestDir, { recursive: true, force: true })
    rmSync(invalidConfigPath, { force: true })
  })
})

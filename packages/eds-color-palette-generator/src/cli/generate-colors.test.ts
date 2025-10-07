import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { execSync } from 'node:child_process'

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
    const cmd = `node ${cliPath} ${configPath} ${testDir}`
    execSync(cmd)

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
    const cmd = `node ${cliPath} ${oklchConfigPath} ${oklchTestDir}`
    execSync(cmd)

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
    const cmd = `node ${cliPath} ${customConfigPath} ${customTestDir}`
    execSync(cmd)

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
    const cmd = `node ${cliPath} ${customFileConfigPath} ${customFileTestDir}`
    execSync(cmd)

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
})

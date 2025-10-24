import { execSync } from 'child_process'
import { existsSync, mkdirSync, rmSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Creates a clean test workspace with fixtures
 */
export function setupTestWorkspace(): string {
  // Create unique workspace for each test run to avoid conflicts
  const testWorkspace = path.resolve(
    __dirname,
    `../test-workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  )

  // Clean and setup test workspace
  if (existsSync(testWorkspace)) {
    rmSync(testWorkspace, { recursive: true, force: true })
  }

  // Create workspace structure
  mkdirSync(testWorkspace, { recursive: true })
  mkdirSync(path.join(testWorkspace, 'tokens'), { recursive: true })
  mkdirSync(path.join(testWorkspace, 'build'), { recursive: true })

  // Copy fixtures to workspace (use rsync for better handling of existing files)
  const fixturesPath = path.resolve(__dirname, 'fixtures')
  execSync(`rsync -a "${fixturesPath}/" "${testWorkspace}/"`)

  return testWorkspace
}

/**
 * Cleans up test workspace
 */
export function cleanupTestWorkspace(testWorkspace: string): void {
  if (existsSync(testWorkspace)) {
    rmSync(testWorkspace, { recursive: true, force: true })
  }
}

/**
 * Runs a specific script in the test workspace
 */
export function runScript(scriptName: string, testWorkspace: string): void {
  const scriptPath = path.resolve(__dirname, `../../dist/scripts/${scriptName}`)
  execSync(`node "${scriptPath}"`, {
    stdio: 'pipe',
    cwd: testWorkspace,
  })
}

/**
 * Runs multiple scripts in sequence
 */
export function runScripts(scriptNames: string[], testWorkspace: string): void {
  for (const scriptName of scriptNames) {
    runScript(scriptName, testWorkspace)
  }
}

/**
 * Gets the path to a script file
 */
export function getScriptPath(scriptName: string): string {
  return path.resolve(__dirname, `../../dist/scripts/${scriptName}`)
}

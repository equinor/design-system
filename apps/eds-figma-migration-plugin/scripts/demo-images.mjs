/**
 * Saves an image of each step of the demo, in Figma's light and dark theme,
 * to demo/dist/images/<step>-<theme>.png, for the docs pages. Build the demo
 * first: pnpm run build:demo.
 *
 * The script is also the smoke test of the demo: it fails when a step does
 * not open (the demo page sets data-state="failed" with the reason), when the
 * view of a step is not visible in the window, and when the built demo
 * contains a name or key from an internal file.
 *
 * It uses the Chromium that comes with Playwright. When that version is not
 * installed, it takes the newest Chromium in Playwright's browser folder, so
 * no browser is downloaded.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs'
import { homedir, platform } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(root, 'demo/dist/index.html')
const out = join(root, 'demo/dist/images')

/**
 * Names and keys that must not be in the built demo, which is published on
 * the public docs site: the internal files the fixtures come from, the
 * person whose case one fixture is, and the file and library keys.
 */
const FORBIDDEN = [
  /FRIOD/i,
  /PE Editor/i,
  /Casper/i,
  /Main Design/i,
  /AI[ -]Testing/i,
  /Not in storybook/i,
  /fileKey/,
  /lk-[0-9a-f]{16,}/,
]

/** What each step shows, checked in the window before the image is saved. */
const STEPS = {
  scan: (ui) => ui.getByRole('button', { name: 'Scan', exact: true }),
  health: (ui) => ui.getByRole('heading', { name: 'Health', exact: true }),
  changes: (ui) =>
    ui.getByRole('tab', { name: 'Changes', exact: true, selected: true }),
  review: (ui) => ui.getByRole('button', { name: 'Stop review' }),
  apply: (ui) => ui.getByText(/^Migrated \d+ values?/),
  revert: (ui) =>
    ui.getByRole('heading', { name: 'Revert the changes in this frame?' }),
  instances: (ui) => ui.getByRole('list', { name: 'Instances' }),
  sources: (ui) => ui.getByText(/^Checked \d+ library components?/),
  'manual-fix': (ui) =>
    ui.getByText(/^Resetting the layer also removes these/).first(),
  typography: (ui) => ui.getByRole('button', { name: /^Convert \d+ to text$/ }),
  statuses: (ui) =>
    ui.getByRole('heading', { name: 'What the categories mean' }),
  modes: (ui) => ui.getByRole('tab', { name: /^Modes \d+$/, selected: true }),
  intro: (ui) =>
    ui.getByRole('heading', {
      name: 'Update your file to the EDS Beta tokens',
    }),
}

const THEMES = ['light', 'dark']

/** Playwright's browser folder, as Playwright finds it. */
function browserFolder() {
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    return process.env.PLAYWRIGHT_BROWSERS_PATH
  }
  if (platform() === 'darwin') {
    return join(homedir(), 'Library/Caches/ms-playwright')
  }
  if (platform() === 'win32') {
    return join(process.env.LOCALAPPDATA ?? homedir(), 'ms-playwright')
  }
  return join(homedir(), '.cache/ms-playwright')
}

const EXECUTABLES = [
  'chrome-headless-shell-mac-arm64/chrome-headless-shell',
  'chrome-headless-shell-mac-x64/chrome-headless-shell',
  'chrome-headless-shell-linux64/chrome-headless-shell',
  'chrome-headless-shell-win64/chrome-headless-shell.exe',
  'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
  'chrome-linux64/chrome',
  'chrome-linux/chrome',
  'chrome-win64/chrome.exe',
  'chrome-win/chrome.exe',
]

/** The newest Chromium in Playwright's browser folder, headless shell first. */
function installedChromium() {
  const folder = browserFolder()
  if (!existsSync(folder)) return undefined
  const builds = readdirSync(folder)
    .map((name) => /^chromium(_headless_shell)?-(\d+)$/.exec(name))
    .filter(Boolean)
    .sort(
      (a, b) => Number(b[2]) - Number(a[2]) || (b[1] ? 1 : 0) - (a[1] ? 1 : 0),
    )
  for (const [name] of builds) {
    for (const executable of EXECUTABLES) {
      const path = join(folder, name, executable)
      if (existsSync(path)) return path
    }
  }
  return undefined
}

async function launch() {
  try {
    return await chromium.launch()
  } catch (error) {
    if (!String(error).includes("Executable doesn't exist")) throw error
    const executablePath = installedChromium()
    if (!executablePath) {
      throw new Error(
        'No Chromium for Playwright is installed. Run `pnpm exec playwright install chromium` once.',
      )
    }
    console.log(
      `Playwright's own Chromium is not installed; using ${executablePath}`,
    )
    return chromium.launch({ executablePath })
  }
}

/** Width and height of a PNG, from its header. */
function pngSize(path) {
  const header = readFileSync(path).subarray(16, 24)
  return [header.readUInt32BE(0), header.readUInt32BE(4)]
}

function kilobytes(bytes) {
  return `${Math.round(bytes / 1024)} kB`
}

async function main() {
  if (!existsSync(demo)) {
    throw new Error(
      'demo/dist/index.html is missing. Run pnpm run build:demo first.',
    )
  }
  const html = readFileSync(demo, 'utf8')
  const found = FORBIDDEN.filter((pattern) => pattern.test(html))
  if (found.length > 0) {
    throw new Error(
      `The built demo contains internal names or keys: ${found.join(', ')}`,
    )
  }
  mkdirSync(out, { recursive: true })
  const url = pathToFileURL(demo).href
  const browser = await launch()
  const failures = []
  const saved = []
  try {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width: 560, height: 840 },
        deviceScaleFactor: 2,
        colorScheme: theme,
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()
      for (const [step, view] of Object.entries(STEPS)) {
        const name = `${step}-${theme}`
        try {
          await page.goto(`${url}?step=${step}&theme=${theme}`)
          const frame = page.locator('.demo-window')
          await page.waitForSelector(
            '.demo-window:is([data-state="ready"], [data-state="failed"])',
            { timeout: 60000 },
          )
          if ((await frame.getAttribute('data-state')) === 'failed') {
            throw new Error(await frame.getAttribute('data-error'))
          }
          const ui = page.frameLocator('.demo-body iframe')
          await view(ui).waitFor({ state: 'visible', timeout: 10000 })
          // A focus ring from opening a dialog is left out of the image, and
          // the EDS fonts have loaded when the network allows it.
          await page.frames()[1]?.evaluate(async () => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur()
            }
            await document.fonts.ready
          })
          const path = join(out, `${name}.png`)
          await frame.screenshot({
            path,
            animations: 'disabled',
            caret: 'hide',
            omitBackground: true,
          })
          saved.push(path)
        } catch (error) {
          failures.push(
            `${name}: ${error instanceof Error ? error.message.split('\n')[0] : error}`,
          )
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }

  let total = 0
  for (const path of saved) {
    const bytes = statSync(path).size
    total += bytes
    const [width, height] = pngSize(path)
    console.log(
      `${path.slice(root.length + 1)}  ${width} × ${height}  ${kilobytes(bytes)}`,
    )
  }
  console.log(`${saved.length} images, ${kilobytes(total)} in all`)
  if (failures.length > 0) {
    throw new Error(`Steps that failed:\n${failures.join('\n')}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

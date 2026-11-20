/**
 * The Vite plugins that build the demo: the plugin window, built from its
 * own config into a string, the cleaned fixtures, and the removal of the
 * library keys from the inventories.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import type { Plugin } from 'vite'
import type { PackedFixture } from '../src/scan/fixture'
import {
  DETAILS_PANEL_NAMES,
  WELL_OVERVIEW_NAMES,
  sanitiseFixture,
} from './sample/sanitise'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * The inventories name the EDS Foundation file by its key, and every library
 * by its library key. The rules and the window only use the collection,
 * variable and text style keys, and the published plugin keeps the file key
 * for the developer export, so the demo leaves the file and library keys out.
 */
export function stripLibraryKeys(): Plugin {
  return {
    name: 'demo-strip-library-keys',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('inventory/new-library.json')) {
        const json = JSON.parse(code) as {
          library: Record<string, unknown>
        }
        json.library = { name: json.library.name }
        return { code: JSON.stringify(json), map: null }
      }
      if (id.endsWith('inventory/old-libraries.json')) {
        const json = JSON.parse(code) as {
          libraries: Record<string, unknown>[]
        }
        for (const library of json.libraries) library.libraryKey = null
        return { code: JSON.stringify(json), map: null }
      }
      return null
    },
  }
}

const WINDOW_ID = 'virtual:demo-window'
const FIXTURES_ID = 'virtual:demo-fixtures'

/**
 * `virtual:demo-window`: the plugin window as one HTML string, built with
 * the plugin's own vite.config.ts, as dist/ui.html is, without the library
 * keys.
 */
export function demoWindow(): Plugin {
  return {
    name: 'demo-window',
    resolveId(id) {
      return id === WINDOW_ID ? `\0${WINDOW_ID}` : null
    },
    async load(id) {
      if (id !== `\0${WINDOW_ID}`) return null
      const result = await build({
        configFile: here('../vite.config.ts'),
        logLevel: 'warn',
        plugins: [stripLibraryKeys()],
        build: { write: false },
      })
      const outputs = Array.isArray(result) ? result : [result]
      for (const output of outputs) {
        if (!('output' in output)) continue
        for (const file of output.output) {
          if (file.type === 'asset' && file.fileName.endsWith('.html')) {
            return `export const windowHtml = ${JSON.stringify(String(file.source))}`
          }
        }
      }
      throw new Error('The window build gave no HTML file')
    },
  }
}

function readFixture(name: string): PackedFixture {
  return JSON.parse(
    readFileSync(here(`../test/fixtures/${name}.json`), 'utf8'),
  ) as PackedFixture
}

/**
 * `virtual:demo-fixtures`: the test frame and the frame with the details
 * panel, cleaned for a public page (sample/sanitise.ts).
 */
export function demoFixtures(): Plugin {
  return {
    name: 'demo-fixtures',
    resolveId(id) {
      return id === FIXTURES_ID ? `\0${FIXTURES_ID}` : null
    },
    load(id) {
      if (id !== `\0${FIXTURES_ID}`) return null
      const wellOverview = sanitiseFixture(readFixture('test-frame'), {
        names: WELL_OVERVIEW_NAMES,
        idPrefix: 10,
      })
      const detailsPanel = sanitiseFixture(readFixture('nested-instances'), {
        names: DETAILS_PANEL_NAMES,
        idPrefix: 20,
      })
      return [
        `export const wellOverview = ${JSON.stringify(wellOverview)}`,
        `export const detailsPanel = ${JSON.stringify(detailsPanel)}`,
      ].join('\n')
    },
  }
}

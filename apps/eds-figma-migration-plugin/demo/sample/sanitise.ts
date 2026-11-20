/**
 * The demo is shown on the public docs site, so the fixtures it is built from
 * are cleaned before they go into it: the file is called Sample file, names
 * from internal files are replaced, and every layer and variable id is
 * replaced with a neutral one. The ids keep their shape (`I12:3;12:7` for a
 * layer inside an instance), since the scan reads the instance chain from it.
 *
 * Runs at build time, in the demo's Vite config, so the raw fixtures never
 * reach the built demo, and in test/demo-sample.test.ts, which checks that
 * the clean fixture is classified as the original is.
 */
import type { PackedFixture } from '../../src/scan/fixture'

export type SampleOptions = {
  /** Whole names to replace: frame, layer, instance and component names */
  names: Record<string, string>
  /** The first number of the new ids, such as 10 for 10:1, 10:2 and so on */
  idPrefix: number
}

/** The name of the file the demo shows. */
export const SAMPLE_FILE_NAME = 'Sample file'

/** A layer id such as 2300:3213, alone or as a step of an instance chain. */
const LAYER_ID = /\d+:\d+/g

export function sanitiseFixture(
  fixture: PackedFixture,
  { names, idPrefix }: SampleOptions,
): PackedFixture {
  const renamed = new Map(Object.entries(names))
  const layerIds = new Map<string, string>()
  const layerId = (id: string): string => {
    let next = layerIds.get(id)
    if (!next) {
      next = `${idPrefix}:${layerIds.size + 1}`
      layerIds.set(id, next)
    }
    return next
  }
  // Variable ids and keys are replaced whole, before the layer ids, since a
  // variable id ends in the id of the variable in its library.
  const exact = new Map<string, string>(renamed)
  Object.values(fixture.variables).forEach((variable, index) => {
    const key = `sample-${idPrefix}-${index + 1}`
    exact.set(variable.id, `VariableID:${key}`)
    exact.set(variable.key, key)
  })
  const text = (value: string): string =>
    exact.get(value) ?? value.replace(LAYER_ID, layerId)
  const walk = (value: unknown): unknown => {
    if (typeof value === 'string') return text(value)
    if (Array.isArray(value)) return value.map(walk)
    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [text(key), walk(item)]),
      )
    }
    return value
  }
  return walk({
    ...fixture,
    generatedAt: '',
    fileName: SAMPLE_FILE_NAME,
  }) as PackedFixture
}

/** The test frame: Migration test, in the file the plugin was tested on. */
export const WELL_OVERVIEW_NAMES: Record<string, string> = {
  'Migration test – old EDS variables': 'Well overview',
}

/**
 * The frame with a panel component whose slot content the instance owns.
 * The names of the EDS Beta components in it are shortened, and the panel
 * and the frame get names of their own.
 */
export const DETAILS_PANEL_NAMES: Record<string, string> = {
  'Casper case (local): PE Editor (test) instance': 'Well details',
  'PE Editor (test)': 'Details panel',
  'Tab [EDS Beta] (Not in storybook)': 'Tab',
  'Badge [EDS Beta] (Not in storybook)': 'Badge',
  'Button [EDS Beta]': 'Button',
}

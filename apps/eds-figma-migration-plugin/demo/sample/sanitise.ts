/**
 * Gives the layers and variables of a fixture new ids before the fixture goes
 * into the demo. Every layer id gets one prefix, such as `10:1`, `10:2` and so
 * on for the test frame, so demo/src/mock/sample.ts can copy layers under
 * another prefix and add layers of its own without a clash. The ids keep
 * their shape (`I12:3;12:7` for a layer inside an instance), since the scan
 * reads the instance chain from it. Variable ids and keys become
 * `sample-…`.
 *
 * Runs at build time, in the demo's Vite config, and in
 * test/demo-sample.test.ts, which checks that the fixture with new ids is
 * classified as the original is.
 */
import type { PackedFixture } from '../../src/scan/fixture'

export type SampleOptions = {
  /** The first number of the new ids, such as 10 for 10:1, 10:2 and so on */
  idPrefix: number
}

/** A layer id such as 2300:3213, alone or as a step of an instance chain. */
const LAYER_ID = /\d+:\d+/g

export function sanitiseFixture(
  fixture: PackedFixture,
  { idPrefix }: SampleOptions,
): PackedFixture {
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
  const exact = new Map<string, string>()
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
  return walk(fixture) as PackedFixture
}

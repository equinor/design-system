/**
 * Developer command: exports the raw scan of one frame as JSON, for
 * test/fixtures. The test runs the same classification on it as the plugin,
 * so the full pipeline is checked without Figma.
 *
 * It imports no inventory, so it can also be bundled on its own and run on
 * the test frame from outside the plugin (vite.fixture.config.ts).
 */
import { OLD_COLLECTION_KEYS, OLD_DENSITY_KEY } from '../../mapping/old-keys'
import { packFixture } from '../../scan/fixture'
import type { PackedFixture } from '../../scan/fixture'
import { Collector, explicitModes } from '../scan/collect'

/** Collects one frame the way a scan does, with the modes set on its ancestors. */
export async function collectFixture(node: SceneNode): Promise<PackedFixture> {
  figma.skipInvisibleInstanceChildren = false
  const inherited: Record<string, string> = {}
  const ancestors: BaseNode[] = []
  for (let parent = node.parent; parent; parent = parent.parent) {
    ancestors.unshift(parent)
  }
  for (const ancestor of ancestors)
    Object.assign(inherited, explicitModes(ancestor))

  const collector = new Collector({
    densityKey: OLD_DENSITY_KEY,
    oldKeys: OLD_COLLECTION_KEYS,
  })
  await collector.collectEntry([node], node.id, inherited)
  return packFixture(
    {
      generatedAt: new Date().toISOString().slice(0, 10),
      fileName: figma.root.name,
      frame: { id: node.id, name: node.name },
    },
    collector.units,
  )
}

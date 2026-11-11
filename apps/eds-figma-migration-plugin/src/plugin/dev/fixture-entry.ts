/**
 * Entry for dist/collect-fixture.js (vite.fixture.config.ts): the fixture
 * export without the plugin window, as one function on the global object. It
 * lets a script that runs Plugin API code in a file, such as the Figma MCP
 * server, export the scan of a frame:
 *
 *   <contents of dist/collect-fixture.js>
 *   return await edsCollectFixture('2300:3213', densityKey, oldKeys)
 *
 * The collection keys are arguments, from src/mapping/inventory/old-libraries.json,
 * so the script carries no inventory and stays small.
 */
import { packFixture } from '../../scan/fixture'
import { Collector, explicitModes } from '../scan/collect'

async function edsCollectFixture(
  nodeId: string,
  densityKey: string,
  oldKeys: string[],
): Promise<string> {
  const node = await figma.getNodeByIdAsync(nodeId)
  if (!node || node.type === 'DOCUMENT' || node.type === 'PAGE') {
    throw new Error(`${nodeId} is not a layer`)
  }
  const ancestors: BaseNode[] = []
  for (let parent = node.parent; parent; parent = parent.parent) {
    ancestors.unshift(parent)
  }
  const page = ancestors.find((ancestor) => ancestor.type === 'PAGE')
  if (page) await (page as PageNode).loadAsync()
  const inherited: Record<string, string> = {}
  for (const ancestor of ancestors) {
    Object.assign(inherited, explicitModes(ancestor))
  }

  figma.skipInvisibleInstanceChildren = false
  const collector = new Collector({ densityKey, oldKeys: new Set(oldKeys) })
  await collector.collectEntry([node as SceneNode], node.id, inherited)
  return JSON.stringify(
    packFixture(
      {
        generatedAt: new Date().toISOString().slice(0, 10),
        fileName: figma.root.name,
        frame: { id: node.id, name: node.name },
      },
      collector.units,
    ),
  )
}

;(globalThis as unknown as Record<string, unknown>).edsCollectFixture =
  edsCollectFixture

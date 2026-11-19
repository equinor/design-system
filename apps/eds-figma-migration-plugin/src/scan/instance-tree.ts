/**
 * Where in an instance its legacy values are: the instances in it, as a
 * tree, with the values each takes from its main component. A panel
 * component such as PE Editor holds Text Fields, Switches and Buttons, some
 * of them hidden, and the Instances tab shows which of them carry the values
 * (Casper's case, 2026-11-18).
 */
import type { BindingRecord, InstanceStep, InstanceTree } from './types'

function nodeOf(step: InstanceStep): InstanceTree {
  return {
    id: step.id,
    name: step.name,
    ...(step.component ? { component: step.component } : {}),
    ...(step.hidden ? { hidden: true as const } : {}),
    ...(step.slot ? { slot: true as const } : {}),
    ...(step.slotName ? { slotName: step.slotName } : {}),
    count: 0,
    hiddenCount: 0,
    own: 0,
    children: [],
  }
}

/**
 * The tree of the instance `root`, from the records of the values it takes
 * from its main component: the records with category Inside instances and
 * `instanceId` set to it. A record without `instances`, from a fixture made
 * before they were recorded, counts on the instance's own layers.
 */
export function buildInstanceTree(
  root: InstanceStep,
  records: BindingRecord[],
): InstanceTree {
  const tree = nodeOf(root)
  for (const record of records) {
    if (record.category !== 'inInstance' || record.instanceId !== root.id) {
      continue
    }
    const chain = record.instances ?? []
    const at = chain.findIndex((step) => step.id === root.id)
    const below = at === -1 ? [] : chain.slice(at + 1)
    let node = tree
    const count = (target: InstanceTree) => {
      target.count += 1
      if (record.hidden) target.hiddenCount += 1
    }
    count(node)
    for (const step of below) {
      let child = node.children.find((item) => item.id === step.id)
      if (!child) {
        child = nodeOf(step)
        node.children.push(child)
      }
      node = child
      count(node)
    }
    node.own += 1
  }
  return tree
}

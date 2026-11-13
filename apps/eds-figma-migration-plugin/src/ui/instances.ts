/** Instances that still use legacy variables, grouped by main component. */
import type { ComponentInstance, OldInstance } from '../scan/types'

export type InstanceGroup = {
  key: string
  name: string
  /** Where the main component is */
  source: string
  /** The main component, when it is in this file */
  mainId?: string
  instances: OldInstance[]
  /** Legacy variables in all of them */
  count: number
}

export function groupInstances(instances: OldInstance[]): InstanceGroup[] {
  const groups = new Map<string, InstanceGroup>()
  for (const instance of instances) {
    const main = instance.mainComponent
    const key = main ? `main:${main.key}` : `name:${instance.name}`
    const group = groups.get(key) ?? {
      key,
      name: main?.name ?? instance.name,
      source: main
        ? main.remote
          ? 'from a library'
          : 'in this file'
        : 'main component not found',
      ...(main?.id && !main.remote ? { mainId: main.id } : {}),
      instances: [],
      count: 0,
    }
    group.instances.push(instance)
    group.count += instance.count
    groups.set(key, group)
  }
  return [...groups.values()].sort((a, b) => b.count - a.count)
}

/** The instances in a main component that come from one main component. */
export type ComponentInstanceGroup = {
  key: string
  name: string
  /** Where the main component is */
  source: string
  /** The main component, when it is in this file */
  mainId?: string
  instances: ComponentInstance[]
  /** Legacy values the instances override, which change in this component */
  overridden: number
  /** Legacy values the instances take from their main component */
  fromMain: number
}

/**
 * The instances in a main component, grouped by their main component: the
 * groups with legacy values first, then by name, each in the scan's order.
 */
export function groupComponentInstances(
  instances: ComponentInstance[],
): ComponentInstanceGroup[] {
  const groups = new Map<string, ComponentInstanceGroup>()
  for (const instance of instances) {
    const main = instance.mainComponent
    const key = main ? `main:${main.key}` : `name:${instance.name}`
    const group = groups.get(key) ?? {
      key,
      name: main?.name ?? instance.name,
      source: main
        ? main.remote
          ? 'from a library'
          : 'in this file'
        : 'main component not found',
      ...(main?.id && !main.remote ? { mainId: main.id } : {}),
      instances: [],
      overridden: 0,
      fromMain: 0,
    }
    group.instances.push(instance)
    group.overridden += instance.overridden
    group.fromMain += instance.fromMain
    groups.set(key, group)
  }
  const legacy = (group: ComponentInstanceGroup) =>
    group.overridden + group.fromMain
  return [...groups.values()].sort(
    (a, b) => legacy(b) - legacy(a) || a.name.localeCompare(b.name, 'en'),
  )
}

/** How many legacy values an instance, or a group of them, overrides and takes from its main component. */
export function legacySummary(overridden: number, fromMain: number): string {
  if (overridden === 0 && fromMain === 0) return 'No legacy values'
  const values = (count: number) =>
    `${count} legacy value${count === 1 ? '' : 's'}`
  return [
    overridden > 0 && `${values(overridden)} overridden here`,
    fromMain > 0 && `${values(fromMain)} from the main component`,
  ]
    .filter(Boolean)
    .join(', ')
}

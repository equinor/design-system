/** Instances that still use legacy variables, grouped by main component. */
import type { OldInstance } from '../scan/types'

export type InstanceGroup = {
  key: string
  name: string
  /** Where the main component is */
  source: string
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
      instances: [],
      count: 0,
    }
    group.instances.push(instance)
    group.count += instance.count
    groups.set(key, group)
  }
  return [...groups.values()].sort((a, b) => b.count - a.count)
}

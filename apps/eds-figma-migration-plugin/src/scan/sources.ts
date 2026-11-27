/** The main components the source check imports (src/plugin/scan/sources.ts), as plain data. */
import type { OldInstance } from './types'

/**
 * One instance for each library main component that instances on the
 * Instances tab use, to check: a main component in this file, or one that
 * could not be read, needs no import. Typography instances are on their own
 * tab and are left out.
 */
export function remoteMainComponents(
  instances: OldInstance[],
): { key: string; instanceId: string }[] {
  const found = new Map<string, string>()
  for (const instance of instances) {
    const main = instance.mainComponent
    if (instance.typography || !main?.remote || found.has(main.key)) continue
    found.set(main.key, instance.id)
  }
  return [...found].map(([key, instanceId]) => ({ key, instanceId }))
}

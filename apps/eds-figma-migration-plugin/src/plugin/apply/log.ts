/** Reads and writes the change log in a layer's shared plugin data. */
import { LOG_KEY, NAMESPACE } from '../../shared/changelog'
import type { LogEntry } from '../../shared/changelog'

export function readLog(node: BaseNode): LogEntry[] {
  const raw = node.getSharedPluginData(NAMESPACE, LOG_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : []
  } catch {
    return []
  }
}

export function writeLog(node: BaseNode, entries: LogEntry[]): void {
  node.setSharedPluginData(
    NAMESPACE,
    LOG_KEY,
    entries.length > 0 ? JSON.stringify(entries) : '',
  )
}

/**
 * Adds an entry to the layer's change log. A layer inside an instance reads
 * the main component's log until the instance has its own plugin data on it,
 * so `inherited` starts the instance's log empty instead of copying that one.
 */
export function appendLog(
  node: BaseNode,
  entry: LogEntry,
  inherited = false,
): void {
  writeLog(node, [...(inherited ? [] : readLog(node)), entry])
}

/**
 * Whether the log on a layer is the main component's, read through an
 * instance: the layer is in an instance, or is one, and the outermost
 * instance has no plugin data of its own on it.
 */
export function logIsInherited(node: BaseNode): boolean {
  let outermost: InstanceNode | undefined
  for (let current: BaseNode | null = node; current; current = current.parent) {
    if (current.type === 'INSTANCE') outermost = current
  }
  if (!outermost) return false
  const own = outermost.overrides.find((override) => override.id === node.id)
  return !(own?.overriddenFields as string[] | undefined)?.includes(
    'pluginData',
  )
}

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

export function appendLog(node: BaseNode, entry: LogEntry): void {
  writeLog(node, [...readLog(node), entry])
}

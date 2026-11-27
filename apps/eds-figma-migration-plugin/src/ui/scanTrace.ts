/**
 * What the window knows about the scan that is running, gathered from the
 * scan messages, for the scan loader to draw. Kept apart from the component
 * so every message is counted, however React batches the renders.
 */
import type { PluginToUi, ScanDot, ScanMap, Scope } from '../shared/messages'

export type ScanTrace = {
  scope?: Scope
  pageCount: number
  pageIndex: number
  /** Unknown until the first page starts */
  pageName?: string
  /** Layers read so far, on every page */
  nodes: number
  /** The map of the page being read, once the page is loaded */
  map?: ScanMap
  /** Share of the scan each tile of the map ends at, from 0 to 1 of the page */
  ends: number[]
  /** Index of the tile being read */
  current?: number
  tilesDone: number
  /** The dots found on the page, one batch per message, so a batch is drawn once */
  dots: ScanDot[][]
}

export const NO_TRACE: ScanTrace = {
  pageCount: 1,
  pageIndex: 0,
  nodes: 0,
  ends: [],
  tilesDone: 0,
  dots: [],
}

/**
 * Where each tile ends on the page's share of the progress bar. The scan
 * has no count of the layers inside a frame before it reads it, so a tile
 * weighs half by its area, since large frames tend to hold more layers, and
 * half by one share per tile, so one large background frame does not take
 * the whole bar.
 */
export function tileEnds(map: ScanMap): number[] {
  const count = map.tiles.length
  if (count === 0) return []
  const areas = map.tiles.map(([, , width, height]) => width * height)
  const totalArea = areas.reduce((sum, area) => sum + area, 0)
  let end = 0
  return areas.map((area) => {
    const byArea = totalArea > 0 ? area / totalArea : 1 / count
    end += (byArea + 1 / count) / 2
    return Math.min(1, end)
  })
}

export type TraceAction = PluginToUi | { type: 'trace-reset' }

export function traceScan(trace: ScanTrace, action: TraceAction): ScanTrace {
  switch (action.type) {
    case 'trace-reset':
      return NO_TRACE
    case 'scan-start':
      return { ...NO_TRACE, scope: action.scope, pageCount: action.pageCount }
    case 'scan-map':
      return {
        ...trace,
        pageIndex: action.pageIndex,
        map: action.map,
        ends: tileEnds(action.map),
        current: undefined,
        tilesDone: 0,
        dots: [],
      }
    case 'scan-progress': {
      const progress = action.progress
      const newPage = progress.pageIndex !== trace.pageIndex
      const dots = newPage ? [] : trace.dots
      return {
        ...trace,
        pageIndex: progress.pageIndex,
        pageCount: progress.pageCount,
        pageName: progress.pageName,
        nodes: progress.nodes,
        map: newPage ? undefined : trace.map,
        ends: newPage ? [] : trace.ends,
        current: progress.current,
        tilesDone: progress.tilesDone ?? (newPage ? 0 : trace.tilesDone),
        dots: progress.dots ? [...dots, progress.dots] : dots,
      }
    }
    default:
      return trace
  }
}

/** How far the scan is, from 0 to 1, across its pages. */
export function scanFraction(trace: ScanTrace): number {
  const pages = Math.max(1, trace.pageCount)
  let page = 0
  if (trace.map) {
    page =
      trace.ends.length === 0
        ? 1
        : trace.tilesDone > 0
          ? (trace.ends[Math.min(trace.tilesDone, trace.ends.length) - 1] ?? 0)
          : 0
  }
  return Math.min(1, (trace.pageIndex + page) / pages)
}

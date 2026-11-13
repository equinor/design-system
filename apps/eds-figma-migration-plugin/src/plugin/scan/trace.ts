/**
 * What the window draws while a scan runs: a map of the top-level layers on
 * each page, which of them is being read, and a sample of the layers where
 * EDS values are found. Nothing here changes what the scan finds.
 */
import { mapLayers, unitOrigin } from '../../scan/trace'
import type { RawUnit } from '../../scan/types'
import type {
  MapRect,
  ScanDot,
  ScanMap,
  ScanProgress,
} from '../../shared/messages'

/** At most one progress message per this many ms, apart from the start and end of a page */
const INTERVAL = 50
/**
 * Dots per message and per page. Reading where a layer is costs a little,
 * so only the layers that become dots are measured.
 */
const DOTS_PER_MESSAGE = 24
const DOTS_PER_PAGE = 1500

type Box = { x: number; y: number; width: number; height: number }

function boxOf(node: SceneNode): Box | null {
  return node.absoluteBoundingBox ?? null
}

/**
 * Follows a scan and posts what the window needs to draw it. scan.ts calls
 * it when a page starts and ends, when a top-level layer starts and ends,
 * and for every unit the collector finds.
 */
export class ScanTracer {
  private readonly index = new Map<string, number>()
  private originX = 0
  private originY = 0
  private page = { name: '', index: 0, count: 1 }
  private current: number | undefined
  private tilesDone = 0
  private pending: ScanDot[] = []
  private pageDots = 0
  private lastDotNode = ''
  private lastPost = 0

  constructor(
    private readonly nodes: () => number,
    private readonly onProgress: (progress: ScanProgress) => void,
    private readonly onMap: (pageIndex: number, map: ScanMap) => void,
  ) {}

  /** A page starts loading; the window shows its name before its map. */
  startPage(name: string, index: number, count: number) {
    this.page = { name, index, count }
    this.index.clear()
    this.current = undefined
    this.tilesDone = 0
    this.pending = []
    this.pageDots = 0
    this.lastDotNode = ''
    this.report(true)
  }

  /** The page is loaded: sends the map of the layers the scan will read. */
  mapPage(pageId: string, roots: readonly SceneNode[], selection: boolean) {
    const layers = mapLayers(roots, selection)
    const boxes = layers.tiles.map(boxOf)
    const sectionBoxes = layers.sections.map(boxOf)
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const box of [...boxes, ...sectionBoxes]) {
      if (!box) continue
      minX = Math.min(minX, box.x)
      minY = Math.min(minY, box.y)
      maxX = Math.max(maxX, box.x + box.width)
      maxY = Math.max(maxY, box.y + box.height)
    }
    if (minX === Infinity) {
      minX = 0
      minY = 0
      maxX = 0
      maxY = 0
    }
    this.originX = minX
    this.originY = minY
    const rect = (box: Box | null): MapRect =>
      box
        ? [
            Math.round(box.x - minX),
            Math.round(box.y - minY),
            Math.round(box.width),
            Math.round(box.height),
          ]
        : [0, 0, 0, 0]
    layers.tiles.forEach((node, index) => this.index.set(node.id, index))
    this.onMap(this.page.index, {
      pageId,
      width: Math.round(maxX - minX),
      height: Math.round(maxY - minY),
      tiles: boxes.map(rect),
      sections: sectionBoxes.map(rect),
    })
  }

  tileStart(nodeId: string) {
    const index = this.index.get(nodeId)
    if (index === undefined) return
    this.current = index
    this.report()
  }

  tileDone(nodeId: string) {
    if (!this.index.has(nodeId)) return
    this.tilesDone += 1
    this.current = undefined
    this.report()
  }

  /** Called by the collector for every unit; keeps a sample of the layers with EDS values. */
  unit(node: SceneNode, unit: RawUnit) {
    if (
      node.id === this.lastDotNode ||
      this.pending.length >= DOTS_PER_MESSAGE ||
      this.pageDots >= DOTS_PER_PAGE
    )
      return
    const origin = unitOrigin(unit)
    if (!origin) return
    const box = boxOf(node)
    if (!box) return
    this.lastDotNode = node.id
    this.pageDots += 1
    this.pending.push([
      Math.round(box.x + box.width / 2 - this.originX),
      Math.round(box.y + box.height / 2 - this.originY),
      origin === 'legacy' ? 1 : 0,
    ])
  }

  /** The collector's count of layers moved on. */
  progress() {
    this.report()
  }

  endPage() {
    this.current = undefined
    this.report(true)
  }

  private report(force = false) {
    const now = Date.now()
    if (!force && now - this.lastPost < INTERVAL) return
    this.lastPost = now
    const dots = this.pending
    this.pending = []
    this.onProgress({
      pageName: this.page.name,
      pageIndex: this.page.index,
      pageCount: this.page.count,
      nodes: this.nodes(),
      current: this.current,
      tilesDone: this.tilesDone,
      ...(dots.length > 0 ? { dots } : {}),
    })
  }
}

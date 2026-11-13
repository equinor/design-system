/* eslint-disable react/no-array-index-key --
   The map's tiles, chunks, dot batches and page marks are fixed lists that only
   grow at the end and are never reordered, so the index is their identity. */
import { memo, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Button } from '@equinor/eds-core-react/next'
import { formatHealth } from '../../scan/summary'
import type { Counts } from '../../scan/types'
import type { MapRect, ScanDot, ScanMap } from '../../shared/messages'
import { scanFraction } from '../scanTrace'
import type { ScanTrace } from '../scanTrace'
import { HealthBar } from './HealthBar'

/**
 * The end of the first scan, shown for a moment before the results: the
 * progress bar turns into the health bar and the health counts up.
 */
export type ScanFinale = {
  health: number | null
  totals: Counts
  nodes: number
}

type ScanLoaderProps = {
  trace: ScanTrace
  /**
   * `initial` fills the window for the first scan after it opens. `rescan`
   * is a card above the results, for Scan again and the scan after an
   * apply, a revert or a convert.
   */
  variant: 'initial' | 'rescan'
  /** The first scan has ended; only for `initial` */
  finale?: ScanFinale
  onCancel: () => void
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** A number that counts up to `target`, or jumps there when motion is reduced. */
function useCountUp(target: number, duration: number): number {
  const [value, setValue] = useState(0)
  const shown = useRef(0)
  useEffect(() => {
    if (prefersReducedMotion()) {
      shown.current = target
      setValue(target)
      return
    }
    const from = shown.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const next = from + (target - from) * (1 - (1 - t) ** 3)
      shown.current = next
      setValue(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

const NUMBER = new Intl.NumberFormat('en-GB')

function CountUp({
  value,
  duration = 400,
}: {
  value: number
  duration?: number
}) {
  return <>{NUMBER.format(Math.round(useCountUp(value, duration)))}</>
}

type View = { x: number; y: number; width: number; height: number }

/**
 * The part of the page the map shows: the area the layers cover with a
 * margin, widened or heightened so a page with one long row of frames does
 * not become a thin line.
 */
function mapView(map: ScanMap, [minAspect, maxAspect]: [number, number]): View {
  const width = Math.max(1, map.width)
  const height = Math.max(1, map.height)
  const margin = Math.max(width, height) * 0.04
  let view = {
    x: -margin,
    y: -margin,
    width: width + margin * 2,
    height: height + margin * 2,
  }
  const aspect = view.width / view.height
  if (aspect > maxAspect) {
    const next = view.width / maxAspect
    view = { ...view, y: view.y - (next - view.height) / 2, height: next }
  } else if (aspect < minAspect) {
    const next = view.height * minAspect
    view = { ...view, x: view.x - (next - view.width) / 2, width: next }
  }
  return view
}

/** A rectangle on the map as percentages of the view, for the layers drawn in HTML over it. */
function placeOf([x, y, width, height]: MapRect, view: View): CSSProperties {
  return {
    left: `${((x - view.x) / view.width) * 100}%`,
    top: `${((y - view.y) / view.height) * 100}%`,
    width: `${(width / view.width) * 100}%`,
    height: `${(height / view.height) * 100}%`,
  }
}

const Rects = memo(function Rects({
  rects,
  className,
}: {
  rects: MapRect[]
  className: string
}) {
  return (
    <g className={className}>
      {rects.map(([x, y, width, height], index) => (
        <rect key={index} x={x} y={y} width={width} height={height} />
      ))}
    </g>
  )
})

/** Tiles are drawn as read in chunks, so a message re-renders only the chunk that changed. */
const CHUNK = 100

const ReadChunk = memo(function ReadChunk({
  tiles,
  count,
}: {
  tiles: MapRect[]
  count: number
}) {
  return (
    <>
      {tiles.slice(0, count).map(([x, y, width, height], index) => (
        <rect key={index} x={x} y={y} width={width} height={height} />
      ))}
    </>
  )
})

function ReadTiles({ tiles, done }: { tiles: MapRect[]; done: number }) {
  const chunks: MapRect[][] = []
  for (let start = 0; start < tiles.length; start += CHUNK) {
    chunks.push(tiles.slice(start, start + CHUNK))
  }
  return (
    <g className="scan-map-read">
      {chunks.map((chunk, index) => (
        <ReadChunk
          key={index}
          tiles={chunk}
          count={Math.max(0, Math.min(chunk.length, done - index * CHUNK))}
        />
      ))}
    </g>
  )
}

const DotBatch = memo(function DotBatch({
  dots,
  view,
}: {
  dots: ScanDot[]
  view: View
}) {
  return (
    <>
      {dots.map(([x, y, legacy], index) => (
        <span
          key={index}
          className="scan-dot"
          data-legacy={legacy === 1 ? '' : undefined}
          style={{
            left: `${((x - view.x) / view.width) * 100}%`,
            top: `${((y - view.y) / view.height) * 100}%`,
          }}
        />
      ))}
    </>
  )
})

/**
 * The page being scanned, drawn from its top-level layers: each frame,
 * component or loose layer as an outline that fills in when it is read, a
 * box that moves to the layer being read, and dots where EDS values were
 * found. Decorative; the text around it says the same.
 */
function ScanMapView({
  trace,
  size,
  done = false,
}: {
  trace: ScanTrace
  size: 'large' | 'small'
  done?: boolean
}) {
  const { map, current, tilesDone, dots } = trace
  if (!map) {
    return (
      <div className="scan-map" data-size={size} data-loading="" aria-hidden />
    )
  }
  const view = mapView(map, size === 'large' ? [0.75, 3] : [1, 3])
  const focus = !done && current !== undefined ? map.tiles[current] : undefined
  return (
    <div className="scan-map" data-size={size} aria-hidden>
      <div
        className="scan-map-canvas"
        // A new page draws in again.
        key={map.pageId}
        style={{ '--_aspect': view.width / view.height } as CSSProperties}
      >
        <svg
          viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
          preserveAspectRatio="none"
        >
          <Rects rects={map.sections} className="scan-map-sections" />
          <Rects rects={map.tiles} className="scan-map-tiles" />
          <ReadTiles
            tiles={map.tiles}
            done={done ? map.tiles.length : tilesDone}
          />
        </svg>
        <div className="scan-map-dots">
          {dots.map((batch, index) => (
            <DotBatch key={index} dots={batch} view={view} />
          ))}
        </div>
        {focus && <span className="scan-focus" style={placeOf(focus, view)} />}
      </div>
    </div>
  )
}

function ScanBar({
  fraction,
  label,
  size,
  pages = 1,
}: {
  fraction: number
  label: string
  size: 'large' | 'small'
  /** A file scan marks where each page starts on the bar */
  pages?: number
}) {
  return (
    <div
      className="scan-bar"
      data-size={size}
      role="progressbar"
      aria-label="Scan"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fraction * 100)}
      aria-valuetext={label}
    >
      <span
        className="scan-bar-fill"
        style={{ inlineSize: `${Math.max(fraction * 100, 2)}%` }}
      />
      {pages > 1 &&
        pages <= 40 &&
        Array.from({ length: pages - 1 }, (_, page) => (
          <span
            key={page}
            className="scan-bar-page"
            style={{ insetInlineStart: `${((page + 1) / pages) * 100}%` }}
          />
        ))}
    </div>
  )
}

function eyebrow(trace: ScanTrace): string {
  switch (trace.scope) {
    case 'file':
      return 'Scanning the file'
    case 'selection':
      return 'Scanning the selection'
    default:
      return 'Scanning the page'
  }
}

/** “12 of 40”: the top-level layers read, counting the one being read. */
function tilesText(trace: ScanTrace): string | undefined {
  if (!trace.map || trace.map.tiles.length === 0) return undefined
  const total = trace.map.tiles.length
  const reached = trace.tilesDone + (trace.current !== undefined ? 1 : 0)
  return `${Math.min(reached, total)} of ${total}`
}

/** “12 of 40 top-level layers”, or what the scan is doing before the page's map arrives. */
function layersText(trace: ScanTrace): string {
  if (!trace.map) return trace.pageName ? 'Loading the page' : 'Starting'
  const tiles = tilesText(trace)
  return tiles ? `${tiles} top-level layers` : 'No layers on the page'
}

/** “2 of 7” for a file scan, or nothing for one page. */
function pageText(trace: ScanTrace): string {
  return trace.pageCount > 1
    ? `${trace.pageIndex + 1} of ${trace.pageCount}`
    : ''
}

/**
 * The scan as it runs, drawn on a map of the page. The first scan after the
 * window opens gets the whole window; a later scan gets a card, since the
 * designer is in the middle of the results.
 */
export function ScanLoader({
  trace,
  variant,
  finale,
  onCancel,
}: ScanLoaderProps) {
  const fraction = finale ? 1 : scanFraction(trace)
  const page = pageText(trace)
  const barLabel = [layersText(trace), page && `page ${page}`]
    .filter(Boolean)
    .join(', ')
  // Announced once per page and at the end, not on every message.
  const announcement = finale
    ? `Scan complete: ${finale.health === null ? 'no EDS variables' : `${formatHealth(finale.health)} migrated`}`
    : `Scanning ${trace.pageName ?? ''}${page ? `, page ${page}` : ''}`

  if (variant === 'rescan') {
    return (
      <section className="scan-loader" data-variant="rescan" aria-label="Scan">
        <p className="visually-hidden" role="status">
          {announcement}
        </p>
        <div className="scan-loader-row">
          <ScanMapView trace={trace} size="small" />
          <div className="scan-loader-text">
            <span className="scan-loader-line">
              Scanning {trace.pageName ?? '…'}
            </span>
            <span className="muted">
              {[
                page && `Page ${page}`,
                layersText(trace),
                `${NUMBER.format(trace.nodes)} layers read`,
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
          <Button variant="secondary" size="small" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <ScanBar fraction={fraction} label={barLabel} size="small" />
      </section>
    )
  }

  return (
    <section
      className="scan-loader"
      data-variant="initial"
      data-done={finale ? '' : undefined}
      aria-labelledby="scan-loader-title"
    >
      <p className="visually-hidden" role="status">
        {announcement}
      </p>
      <div className="scan-loader-heading">
        <p className="scan-loader-eyebrow">
          {finale ? 'Scan complete' : eyebrow(trace)}
        </p>
        <h2 id="scan-loader-title" className="scan-loader-title">
          {trace.pageName ?? 'Getting ready'}
        </h2>
      </div>
      <ScanMapView trace={trace} size="large" done={finale !== undefined} />
      {finale ? (
        <HealthBar counts={finale.totals} />
      ) : (
        <ScanBar
          fraction={fraction}
          label={barLabel}
          size="large"
          pages={trace.pageCount}
        />
      )}
      <dl className="scan-loader-stats">
        {finale ? (
          <div data-lead="">
            <dt>Migrated</dt>
            <dd>
              {finale.health === null ? (
                '–'
              ) : (
                <>
                  <CountUp
                    value={Math.floor(finale.health * 100)}
                    duration={900}
                  />
                  %
                </>
              )}
            </dd>
          </div>
        ) : null}
        <div data-lead={finale ? undefined : ''}>
          <dt>Layers read</dt>
          <dd>
            <CountUp value={finale ? finale.nodes : trace.nodes} />
          </dd>
        </div>
        {!finale && tilesText(trace) && (
          <div>
            <dt>Top-level layers</dt>
            <dd>{tilesText(trace)}</dd>
          </div>
        )}
        {!finale && trace.pageCount > 1 && (
          <div>
            <dt>Page</dt>
            <dd>
              {trace.pageIndex + 1} of {trace.pageCount}
            </dd>
          </div>
        )}
      </dl>
      <div className="scan-loader-footer">
        <ul className="scan-loader-legend" aria-hidden>
          <li>
            <span className="scan-dot" data-legacy="" /> Legacy
          </li>
          <li>
            <span className="scan-dot" /> Migrated
          </li>
        </ul>
        {!finale && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </section>
  )
}

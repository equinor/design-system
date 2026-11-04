'use client'

import { useEffect, useRef, useState } from 'react'
import {
  isMessage,
  type FromPreview,
  type ToPreview,
} from '../../../lib/messages'
import type { ColorScheme, Density, View } from '../../../lib/preferences'

/** The viewport the dashboard is laid out in for Row and Column, scaled to
 * fit the area (1280 × 810 keeps its proportions). In
 * Fullscreen the dashboard fills the area, at least this wide. */
const VIEWPORT = { width: 1280, height: 810 }

type FrameProps = {
  css: string
  colorScheme: ColorScheme
  density: Density
  view: View
  /** Shows the class names in the frame, and reports the one clicked */
  inspect: boolean
  onToggleMode: () => void
  onInspectPick: (classes: string[]) => void
  onInspectOff: () => void
}

function post(frame: HTMLIFrameElement | null, message: ToPreview) {
  frame?.contentWindow?.postMessage(message, window.location.origin)
}

/** The size of the iframe and its scale, so it fits the area. */
function fit(area: { width: number; height: number }, view: View) {
  if (area.width === 0 || area.height === 0) {
    return { width: VIEWPORT.width, height: VIEWPORT.height, scale: 1 }
  }
  if (view === 'fullscreen') {
    const width = Math.max(area.width, VIEWPORT.width)
    const scale = area.width / width
    return { width, height: area.height / scale, scale }
  }
  const scale = Math.min(
    area.width / VIEWPORT.width,
    area.height / VIEWPORT.height,
  )
  return { ...VIEWPORT, scale }
}

/** The dashboard in an iframe. The CSS from the editor is plain global CSS,
 * so it must not reach the editor app, and the colour scheme has to sit on
 * the dashboard's own root element. */
export function Frame({
  css,
  colorScheme,
  density,
  view,
  inspect,
  onToggleMode,
  onInspectPick,
  onInspectOff,
}: FrameProps) {
  const area = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 })
  const [ready, setReady] = useState(false)
  const [src] = useState(
    () => `preview/?scheme=${colorScheme}&density=${density}`,
  )

  const { width, height, scale } = fit(areaSize, view)

  const latest = useRef({
    css,
    colorScheme,
    density,
    inspect,
    scale,
    onToggleMode,
    onInspectPick,
    onInspectOff,
  })
  latest.current = {
    css,
    colorScheme,
    density,
    inspect,
    scale,
    onToggleMode,
    onInspectPick,
    onInspectOff,
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== iframe.current?.contentWindow) return
      if (!isMessage<FromPreview>(event.data)) return
      if (event.data.type === 'eds-demo:ready') {
        const current = latest.current
        post(iframe.current, {
          type: 'eds-demo:settings',
          colorScheme: current.colorScheme,
          density: current.density,
          inspect: current.inspect,
          scale: current.scale,
        })
        post(iframe.current, { type: 'eds-demo:css', css: current.css })
        setReady(true)
      } else if (event.data.type === 'eds-demo:toggle-mode') {
        latest.current.onToggleMode()
      } else if (event.data.type === 'eds-demo:inspect-pick') {
        latest.current.onInspectPick(event.data.classes)
      } else if (event.data.type === 'eds-demo:inspect-off') {
        latest.current.onInspectOff()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Typing sends the CSS after a short pause, not on every key.
  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(
      () => post(iframe.current, { type: 'eds-demo:css', css }),
      100,
    )
    return () => window.clearTimeout(timer)
  }, [css, ready])

  useEffect(() => {
    if (ready) {
      post(iframe.current, {
        type: 'eds-demo:settings',
        colorScheme,
        density,
        inspect,
        scale,
      })
    }
  }, [colorScheme, density, inspect, scale, ready])

  useEffect(() => {
    const element = area.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setAreaSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={area} className="workbench-frame-area">
      <div className="workbench-frame-box">
        <p className="frame-disclaimer">
          For learning the tokens: the dashboard is not a reference for the EDS
          Beta components
        </p>
        <div
          className="workbench-frame"
          style={{ width: `${width * scale}px`, height: `${height * scale}px` }}
        >
          <iframe
            ref={iframe}
            src={src}
            title="Dashboard preview"
            className="workbench-iframe"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transform: `scale(${scale})`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

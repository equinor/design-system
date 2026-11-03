'use client'

import { useEffect } from 'react'
import {
  isMessage,
  isToggleShortcut,
  type FromPreview,
  type ToPreview,
} from '../../../lib/messages'
import { classesIn, startInspector } from './inspector'

/** Receives the CSS and the settings from the editor app and applies them:
 * the CSS goes into one <style> element after every other stylesheet, so it
 * wins over the layered EDS CSS as unlayered app CSS does. */
export function PreviewBridge() {
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'user-css'
    document.head.append(style)

    const html = document.documentElement
    const embedded = window.parent !== window
    const send = (message: FromPreview) =>
      window.parent.postMessage(message, window.location.origin)

    // Opened on its own, there is no editor to wait for.
    if (!embedded) html.dataset.ready = ''

    let classes = new Set<string>()
    let stopInspector: (() => void) | null = null
    const inspect = (on: boolean) => {
      if (on && !stopInspector) {
        stopInspector = startInspector(
          () => classes,
          (picked) => send({ type: 'eds-demo:inspect-pick', classes: picked }),
        )
      } else if (!on && stopInspector) {
        stopInspector()
        stopInspector = null
      }
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (!isMessage<ToPreview>(event.data)) return
      const message = event.data
      if (message.type === 'eds-demo:css') {
        style.textContent = message.css
        classes = classesIn(message.css)
        html.dataset.ready = ''
        send({ type: 'eds-demo:applied' })
      } else if (message.type === 'eds-demo:settings') {
        html.dataset.colorScheme = message.colorScheme
        html.dataset.density = message.density
        // The inspector's label is drawn at full size in a scaled frame.
        html.style.setProperty('--eds-demo-zoom', String(1 / message.scale))
        inspect(message.inspect)
      }
    }

    // The shortcut also works while the frame has focus.
    const onKeyDown = (event: KeyboardEvent) => {
      if (!embedded || !isToggleShortcut(event)) return
      event.preventDefault()
      send({ type: 'eds-demo:toggle-mode' })
    }

    window.addEventListener('message', onMessage)
    window.addEventListener('keydown', onKeyDown)
    if (embedded) send({ type: 'eds-demo:ready' })

    return () => {
      window.removeEventListener('message', onMessage)
      window.removeEventListener('keydown', onKeyDown)
      inspect(false)
      style.remove()
    }
  }, [])

  return null
}

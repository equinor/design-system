/**
 * Shrinks the window to the room Figma gives it. Figma caps a plugin window
 * at the height of the canvas, title bar included, and when the window asks
 * for more it does not shrink the window's frame: it clips the frame and
 * scrolls it, so the bottom of the window, with the Apply bar fixed there,
 * is out of view until the person scrolls (2026-11-20: a 720 px window in a
 * 720 px dialog lost its bottom 40 px under the title bar). The window cannot
 * read the canvas height, but an IntersectionObserver on a layer that fills
 * the window sees how much of it is in view, through Figma's frames too, so
 * the window asks to be that tall. The size a person gave the window is kept,
 * and the next window opens at it if there is room.
 */
import { fitHeight } from '../shared/window'
import { send } from './figma'

let paused = false

/**
 * While the grip is dragged, the window may be taller than the room for a
 * moment; it is fitted once the drag ends, when the window has its size.
 */
export function pauseFitting(pause: boolean) {
  paused = pause
}

/** Watches how much of the window is in view, and fits it when it is clipped. */
export function watchClipping(): () => void {
  const probe = document.createElement('div')
  probe.className = 'fit-probe'
  probe.setAttribute('aria-hidden', 'true')
  document.body.append(probe)
  // A threshold every 0.1 %, so any change in a clipped window reports
  const threshold = Array.from({ length: 1001 }, (_, index) => index / 1000)
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1]
      if (!entry || paused) return
      const visible = entry.intersectionRect.height
      // Out of view as a whole, as when Figma hides the window: nothing to fit
      if (visible <= 0) return
      if (window.innerHeight - visible < 2) return
      send({
        type: 'resize',
        width: window.innerWidth,
        height: fitHeight(visible),
        done: false,
        fit: true,
      })
    },
    { threshold },
  )
  observer.observe(probe)
  return () => {
    observer.disconnect()
    probe.remove()
  }
}

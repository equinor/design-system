/**
 * Shared state machine for route-change view transitions.
 *
 * The navigation must happen INSIDE `document.startViewTransition()`'s update
 * callback: the browser snapshots the old page first, then runs the callback,
 * and snapshots the new page once the returned promise resolves. Starting the
 * transition after navigation begins (e.g. from Docusaurus's `onRouteUpdate`)
 * captures the already-swapped DOM as the "old" state and the fade becomes a
 * new→new blink.
 *
 * `startPageTransition` is called by the click interceptor in
 * `src/theme/Root.tsx`; `settlePageTransition` is called by the
 * `onRouteDidUpdate` client-module hook once the new page's DOM is committed.
 */

/** Skip the animation if the next route's lazy chunk is slower than this. */
const TRANSITION_TIMEOUT_MS = 300

let pendingResolve: (() => void) | null = null
let pendingTransition: ViewTransition | null = null
let timeoutId: number | undefined

export function canStartPageTransition(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Resolve the pending transition's update callback (idempotent). */
export function settlePageTransition(): void {
  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId)
    timeoutId = undefined
  }
  pendingResolve?.()
  pendingResolve = null
  pendingTransition = null
}

/**
 * Snapshot the current page, run `navigate` (which triggers the React route
 * swap), and hold the transition open until `settlePageTransition` fires.
 */
export function startPageTransition(navigate: () => void): void {
  // A navigation started while a transition is still pending (fast clicking):
  // skip the in-flight animation and release its update callback first.
  pendingTransition?.skipTransition()
  settlePageTransition()

  pendingTransition = document.startViewTransition(() => {
    // Arm the resolver BEFORE navigating — if React commits the new route
    // synchronously, onRouteDidUpdate settles during navigate() itself.
    const domUpdated = new Promise<void>((resolve) => {
      pendingResolve = resolve
    })
    timeoutId = window.setTimeout(settlePageTransition, TRANSITION_TIMEOUT_MS)
    navigate()
    return domUpdated
  })
}

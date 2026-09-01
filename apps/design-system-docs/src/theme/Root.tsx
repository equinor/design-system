/**
 * Root wrapper — intercepts internal link clicks so the route swap runs
 * inside a View Transition (see src/utils/pageTransitions.ts for why the
 * navigation must be deferred into the transition callback).
 *
 * The capture-phase listener runs before react-router's Link handler;
 * eligible clicks are prevented + stopped and re-issued as `history.push`
 * inside `startPageTransition`. Anything ineligible (external, new-tab,
 * modified click, hash-only, asset-like path, unsupported browser, reduced
 * motion) falls through to the default behaviour untouched.
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useHistory } from '@docusaurus/router'

import {
  canStartPageTransition,
  startPageTransition,
} from '@site/src/utils/pageTransitions'

/** Paths whose last segment has an extension (files, not SPA routes). */
const looksLikeAsset = (pathname: string): boolean =>
  /\.[a-zA-Z0-9]+$/.test(pathname)

export default function Root({ children }: { children: ReactNode }): ReactNode {
  const history = useHistory()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (looksLikeAsset(url.pathname)) return
      // Hash-only change (same-page anchor) — no fade.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return

      if (!canStartPageTransition()) return

      // Take over from react-router's Link handler: prevent the default
      // navigation AND the bubble-phase onClick that would push immediately.
      event.preventDefault()
      event.stopPropagation()
      startPageTransition(() => {
        history.push(url.pathname + url.search + url.hash)
      })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [history])

  return <>{children}</>
}

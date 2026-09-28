import React, { type ReactNode } from 'react'
import SearchBar from '@theme-original/SearchBar'
import useIsBrowser from '@docusaurus/useIsBrowser'
import './docs-search-bar.css'

/**
 * The search plugin already swaps the shortcut hint per platform on its own
 * (`⌘` on macOS, `ctrl` elsewhere, from the default `mod+k` keymap), so
 * nothing here needs to switch the symbol. We only mirror the same detection
 * onto the wrapper so the CSS can set the two keys flush as "⌘K" the way
 * Figma does, and keep them spaced for the wider "Ctrl K".
 */
function useIsMac(): boolean {
  const isBrowser = useIsBrowser()

  if (!isBrowser) {
    return false
  }

  const { userAgent, userAgentData } = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }

  return /mac/i.test(userAgentData?.platform ?? userAgent)
}

export default function SearchBarWrapper(): ReactNode {
  const isMac = useIsMac()

  return (
    <div className="docs-search-bar" data-platform={isMac ? 'mac' : undefined}>
      <SearchBar />
    </div>
  )
}

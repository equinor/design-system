/**
 * Swizzled from @docusaurus/theme-classic 3.10.2 — verbatim except for the
 * `hiddenSidebar` initial state, marked FIX below.
 *
 * Upstream splits the collapsed sidebar into two pieces of state:
 *
 * - `hiddenSidebarContainer` lives in `DocRoot/Layout` and only tracks the
 *   container width. It survives client-side navigation.
 * - `hiddenSidebar` lives HERE and is what actually hides the menu and swaps in
 *   the expand rail. It is normally set from `onTransitionEnd` once the
 *   container has finished shrinking.
 *
 * `DocRoot/Layout` only renders this component when the doc resolves a sidebar,
 * so a doc with `displayed_sidebar: null` (the /resources, /support and
 * getting-started landings) unmounts it and destroys `hiddenSidebar` while
 * `hiddenSidebarContainer` stays true. Navigating on to a doc that does have a
 * sidebar then remounted it with `hiddenSidebar: false` inside a container still
 * sized to `--doc-sidebar-hidden-width`: the menu rendered at full width, got
 * clipped to a ~56px strip of truncated labels, and no expand rail was rendered
 * to recover from — only a hard reload cleared it.
 *
 * Seeding `hiddenSidebar` from `hiddenSidebarContainer` keeps the two in step
 * across a remount, and preserves the reader's collapsed preference. Re-diff
 * against upstream on Docusaurus upgrades.
 */

import { Fragment, useCallback, useState } from 'react'
import clsx from 'clsx'
import { prefersReducedMotion, ThemeClassNames } from '@docusaurus/theme-common'
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
import DocSidebar from '@theme/DocSidebar'
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton'

import type { ReactNode } from 'react'
import type { Props } from '@theme/DocRoot/Layout/Sidebar'

import styles from './styles.module.css'

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }: { children: ReactNode }) {
  const sidebar = useDocsSidebar()
  return <Fragment key={sidebar?.name ?? 'noSidebar'}>{children}</Fragment>
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: Props): ReactNode {
  const { pathname } = useLocation()
  // FIX: upstream is `useState(false)`. Seeding from the container flag keeps a
  // remount (see the file header) from landing in the clipped, unrecoverable
  // half-collapsed state.
  const [hiddenSidebar, setHiddenSidebar] = useState(hiddenSidebarContainer)
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false)
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true)
    }
    setHiddenSidebarContainer((value) => !value)
  }, [setHiddenSidebarContainer, hiddenSidebar])
  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
          return
        }
        if (hiddenSidebarContainer) {
          setHiddenSidebar(true)
        }
      }}
    >
      <ResetOnSidebarChange>
        <div
          className={clsx(
            styles.sidebarViewport,
            hiddenSidebar && styles.sidebarViewportHidden,
          )}
        >
          <DocSidebar
            sidebar={sidebar}
            path={pathname}
            onCollapse={toggleSidebar}
            isHidden={hiddenSidebar}
          />
          {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
        </div>
      </ResetOnSidebarChange>
    </aside>
  )
}

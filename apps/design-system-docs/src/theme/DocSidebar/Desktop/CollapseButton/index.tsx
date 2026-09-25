/**
 * Swizzled (eject) from @docusaurus/theme-classic 3.10.2 — verbatim except for
 * the icon, marked FIX below. `styles.module.css` alongside it keeps upstream's
 * rules and values; re-diff both against upstream on Docusaurus upgrades.
 *
 * Upstream renders `@theme/Icon/Arrow`, a hand-rolled double-chevron with a
 * hardcoded `#7a7a7a` fill that cannot follow the colour scheme, and points it
 * the right way with a CSS rotation. EDS ships the same glyph as a real icon
 * in both directions, so the collapse button takes `collapse` and the expand
 * rail (`DocRoot/Layout/Sidebar/ExpandButton`, ejected for the same reason)
 * takes `expand`. Two icons rather than one rotated one is what forced both
 * buttons to be ejected: the shared `Icon/Arrow` swizzle they used to go
 * through cannot tell which of the two is rendering it.
 */

import clsx from 'clsx'
import { translate } from '@docusaurus/Translate'
import { collapse } from '@equinor/eds-icons'
import { Icon } from '@site/src/components/Icon'

import type { ReactNode } from 'react'
import type { Props } from '@theme/DocSidebar/Desktop/CollapseButton'

import styles from './styles.module.css'

export default function CollapseButton({ onClick }: Props): ReactNode {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      className={clsx(
        'button button--secondary button--outline',
        styles.collapseSidebarButton,
      )}
      onClick={onClick}
    >
      {/* FIX: the EDS icon already points left, so upstream's
          `styles.collapseSidebarButtonIcon` — which exists only to rotate and
          nudge the arrow — is deliberately not applied. Size and colour come
          from `site-chrome.css`. This also drops upstream's RTL flip, which
          the site does not use (`locales: ['en']`). */}
      <Icon data={collapse} />
    </button>
  )
}

/**
 * Swizzled (eject) from @docusaurus/theme-classic 3.10.2 — verbatim except for
 * the icon, marked FIX below. `styles.module.css` alongside it keeps upstream's
 * rules and values; re-diff both against upstream on Docusaurus upgrades.
 *
 * See `DocSidebar/Desktop/CollapseButton` for why both buttons are ejected:
 * they now use the two directional EDS icons (`expand` here, `collapse`
 * there) instead of one rotated `@theme/Icon/Arrow`.
 */

import { translate } from '@docusaurus/Translate'
import { expand } from '@equinor/eds-icons'
import { Icon } from '@site/src/components/Icon'

import type { ReactNode } from 'react'
import type { Props } from '@theme/DocRoot/Layout/Sidebar/ExpandButton'

import styles from './styles.module.css'

export default function DocRootLayoutSidebarExpandButton({
  toggleSidebar,
}: Props): ReactNode {
  return (
    <div
      className={styles.expandButton}
      title={translate({
        id: 'theme.docs.sidebar.expandButtonTitle',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.expandButtonAriaLabel',
        message: 'Expand sidebar',
        description:
          'The ARIA label and title attribute for expand button of doc sidebar',
      })}
      tabIndex={0}
      role="button"
      onKeyDown={toggleSidebar}
      onClick={toggleSidebar}
    >
      {/* FIX: the EDS icon already points right, so upstream's
          `styles.expandButtonIcon` — which exists only to set the rotation —
          is deliberately not applied. Size and colour come from
          `site-chrome.css`. This also drops upstream's RTL flip, which the
          site does not use (`locales: ['en']`). */}
      <Icon data={expand} />
    </div>
  )
}

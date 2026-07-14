import clsx from 'clsx'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/plugin-content-docs/client'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemContent from '@theme/DocItem/Content'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import ContentVisibility from '@theme/ContentVisibility'

import type { JSX } from 'react'
import type { Props } from '@theme/DocItem/Layout'

import styles from './styles.module.css'

/** Decide whether the TOC should render, on mobile or desktop viewports. */
function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()
  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0
  const mobile = canRender ? <DocItemTOCMobile /> : undefined
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined
  return { hidden, mobile, desktop }
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC()
  const { metadata, frontMatter } = useDoc()

  // Component reference docs render a full-width hero band (title + lead) above
  // the standard three-column doc body. Gated on `hide_title` so foundation
  // pages and the /components landing keep their own layouts.
  const showHero =
    frontMatter.hide_title === true && metadata.id.startsWith('components/')

  return (
    <>
      {showHero && (
        <header className={styles.docHero}>
          <div className={styles.docHeroInner}>
            <h1 className={styles.docHeroTitle}>{metadata.title}</h1>
            {metadata.description && (
              <p className={styles.docHeroLead}>{metadata.description}</p>
            )}
          </div>
        </header>
      )}
      <div className="row">
        <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
          <ContentVisibility metadata={metadata} />
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article>
              <DocBreadcrumbs />
              <DocVersionBadge />
              {docTOC.mobile}
              <DocItemContent>{children}</DocItemContent>
              <DocItemFooter />
            </article>
            <DocItemPaginator />
          </div>
        </div>
        {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
      </div>
    </>
  )
}

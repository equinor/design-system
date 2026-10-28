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
import ContentVisibility from '@theme/ContentVisibility'
import Link from '@docusaurus/Link'

import { BetaNotice } from '@site/src/components/BetaNotice'
import { DotField } from '@site/src/components/DotField'

import type { JSX } from 'react'
import type { Props } from '@theme/DocItem/Layout'

import styles from './styles.module.css'

/** Doc versions that render with the redesign: current and the frozen 2.0.0-beta. */
const REDESIGN_VERSIONS = new Set(['current', '2.0.0-beta'])

/**
 * Every version says what it is, on every page. Docusaurus's own version
 * banner cannot: it shows nothing on the lastVersion, which left Latest without
 * the package versions it covers, nothing on the current version, which left
 * the beta pages with no sign that they are beta or that beta is safe to
 * adopt, and it calls the 2.0.0-beta archive "unreleased" because
 * versions.json lists it before lastVersion. All three are configured with
 * `banner: 'none'` and get these notes instead. See #4942 and #5667.
 */
const LATEST_VERSION = '1.1.0'
const BETA_VERSION = 'current'
const EARLIER_BETA_VERSION = '2.0.0-beta'

/** The section that explains which package versions Latest and Beta are. */
const VERSIONS_SECTION =
  '/docs/Next/about/getting-started/develop/getting_started_development#versioning'

/**
 * The Beta note states the component API's path to 3.0.0, which is
 * `eds-core-react`'s release, not every package's. The colour and design-token
 * pages follow `eds-tokens`, whose beta is a different story: the redefined
 * tokens only exist under the `next/css/*` subpaths, `css/variables` is still
 * the 2.x bundle, and ADR-0010 moves them again at 3.0.0. That belongs in one
 * place written for it (#5242), not in a box repeated on every page, so the
 * note is scoped to the component docs.
 *
 * `components/components` is excluded because it writes its own title inside
 * the MDX, which would leave the note above the title instead of under it.
 * That page renders `<BetaNotice>` itself, after its `<Hero>`.
 */
const BETA_NOTICE_SECTION = 'components/'
const BETA_NOTICE_SELF_PLACED = new Set(['components/components'])

function VersionNotice({ version, docId }: { version: string; docId: string }) {
  if (version === LATEST_VERSION) {
    return (
      <div className="alert alert--info margin-bottom--md" role="note">
        Latest is <code>@equinor/eds-core-react</code> 2.x and{' '}
        <code>@equinor/eds-tokens</code> 2.x, and stays supported until 3.0.0 is
        released. <Link to="/docs/Next/components">Beta</Link> is the 3.0.0
        beta, safe to adopt alongside it. See{' '}
        <Link to={VERSIONS_SECTION}>Versioning</Link> for which packages belong
        to each.
      </div>
    )
  }

  if (version === EARLIER_BETA_VERSION) {
    return (
      <div className="alert alert--warning margin-bottom--md" role="note">
        This is the earlier beta (<code>2.0.0-beta</code>), frozen before the
        colour foundation was redefined and no longer updated. For the current
        beta, see <Link to="/docs/Next/components">Beta</Link>.
      </div>
    )
  }

  if (
    version === BETA_VERSION &&
    docId.startsWith(BETA_NOTICE_SECTION) &&
    !BETA_NOTICE_SELF_PLACED.has(docId)
  ) {
    return <BetaNotice />
  }

  return <DocVersionBanner />
}

/** Doc sections whose pages can render the hero band. */
const HERO_SECTIONS = ['components/', 'foundation/']

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

  // Component and foundation docs render a full-width hero band (title + lead)
  // above the standard three-column doc body. Gated on `hide_title` so the
  // /components landing and the frozen 2.0.0-beta foundation pages, which still
  // carry their title in the markdown, keep their own layouts, and on the
  // redesigned versions so the 1.1.0 archive can never opt in via frontmatter.
  const showHero =
    frontMatter.hide_title === true &&
    HERO_SECTIONS.some((section) => metadata.id.startsWith(section)) &&
    REDESIGN_VERSIONS.has(metadata.version)

  return (
    <>
      {showHero && (
        <header className={clsx(styles.docHero, 'docs-dot-host')}>
          <DotField />
          <div className={styles.docHeroInner}>
            {/* Mirrors the `.row` / `.col` chain the doc body below uses, so the
                hero text lines up with `.theme-doc-markdown` exactly — same
                gutters, same 75% column when the TOC takes the remaining 25%. */}
            <div className="row">
              <div className={clsx('col', !docTOC.hidden && styles.docHeroCol)}>
                <h1 className={styles.docHeroTitle}>{metadata.title}</h1>
                {metadata.description && (
                  <p className={styles.docHeroLead}>{metadata.description}</p>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      <div className="row">
        <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
          <ContentVisibility metadata={metadata} />
          <VersionNotice version={metadata.version} docId={metadata.id} />
          <div className={styles.docItemContainer}>
            {/* No <DocBreadcrumbs />: the docs plugin sets
                `breadcrumbs: false`, so upstream would render nothing here. */}
            <article>
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

import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { color_palette, widgets, help, arrow_forward } from '@equinor/eds-icons'

import { Hero as PageHero } from '@site/src/components/Hero'
import { DocsSection } from '@site/src/components/DocsSection'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import type { IconCardProps } from '@site/src/components/IconCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { Icon } from '@site/src/components/Icon'
import { githubUrl, storybookUrl } from '@site/src/data/siteLinks'
import {
  useShownDocsVersion,
  useShownVersionDocPath,
} from '../../utils/useShownVersionDocPath'
import type { VersionedDocTarget } from '../../utils/useShownVersionDocPath'

import Designer from '../../../static/img/illustrations/designer_illu.svg'
import Devices from '../../../static/img/illustrations/devices_illu.svg'

import './homepage-sections.css'

/* Brand marks are kept as inline SVG — they are third-party logos, not EDS icons. */
const FigmaMark = () => (
  <svg viewBox="0 0 38 57" aria-hidden="true">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path
      d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"
      fill="#0ACF83"
    />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
    <path
      d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"
      fill="#F24E1E"
    />
    <path
      d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"
      fill="#A259FF"
    />
  </svg>
)

const StorybookMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M16.34.29l-.12 2.17a.18.18 0 0 0 .29.15l1.06-.8.9.7a.18.18 0 0 0 .28-.15L18.63.2l1.14-.08a1.12 1.12 0 0 1 1.2 1.06l.83 18.56a1.12 1.12 0 0 1-1.06 1.18L6.97 21.8a1.12 1.12 0 0 1-1.17-.97L4.34 2.07A1.12 1.12 0 0 1 5.31.9l11.03-.6zm-2.59 7.83c0 .45 2.78.23 3.15-.08 0-2.77-1.49-4.22-4.21-4.22-2.73 0-4.25 1.5-4.25 3.75 0 3.9 5.25 3.97 5.25 6.1 0 .58-.25 1.09-1.05 1.09-.95 0-1.35-.49-1.3-2.16 0-.35-3.2-.46-3.31 0-.23 3.54 1.96 4.57 4.64 4.57 2.6 0 4.43-1.39 4.43-3.9 0-4.18-5.36-4.05-5.36-6.14 0-.8.56-1.1 1.08-1.1.56 0 1.1.17.93 2.09z"
      fill="#FF4785"
    />
  </svg>
)

/**
 * The docs the home page links to. Each exists in every version, and each link
 * opens the version the navbar dropdown shows: Latest by default, Beta once
 * the reader picks it (#5667). `to` is the Latest path.
 */
const DOCS = {
  design: {
    docId: 'about/getting-started/design/getting_started_design',
    to: 'docs/about/getting-started/design/getting_started_design',
  },
  develop: {
    docId: 'about/getting-started/develop/getting_started_development',
    to: 'docs/about/getting-started/develop/getting_started_development',
  },
  components: { docId: 'components/components', to: 'docs/components/' },
  figma: {
    docId: 'about/getting-started/design/figma',
    to: 'docs/about/getting-started/design/figma',
  },
  support: { docId: 'support/support', to: 'docs/support' },
  resources: { docId: 'resources/resources', to: 'docs/resources' },
} satisfies Record<string, VersionedDocTarget>

/* ======================================
 * 1. HERO + INTRO
 * ====================================== */

/** Brand header — a single centred title on the dot field, per the Figma design. */
export function Hero(): ReactNode {
  return <PageHero dots variant="display" title="Equinor Design System" />
}

/** The lead and the two entry points, which the display hero no longer carries. */
export function Intro(): ReactNode {
  const docPath = useShownVersionDocPath()
  return (
    <DocsSection
      title="Get started"
      subtitle="Dive right in to the Equinor Design System, get started with design and development."
      tone="muted"
    >
      <div className="docs-entry-grid">
        <Link to={docPath(DOCS.design)} className="docs-entry-card">
          <Designer
            className="docs-entry-card__illustration"
            aria-hidden="true"
          />
          <div className="docs-entry-card__content">
            <h3>Design</h3>
            <p>
              Set up the Figma libraries and start designing with EDS components
              and tokens.
            </p>
          </div>
        </Link>

        <Link to={docPath(DOCS.develop)} className="docs-entry-card">
          <Devices
            className="docs-entry-card__illustration"
            aria-hidden="true"
          />
          <div className="docs-entry-card__content">
            <h3>Develop</h3>
            <p>
              Install the packages and start building with React components and
              design tokens.
            </p>
          </div>
        </Link>
      </div>
    </DocsSection>
  )
}

/* ======================================
 *  BROWSE BY CATEGORY
 * ====================================== */

const FOUNDATIONS_CARD = {
  icon: color_palette,
  title: 'Foundations',
  description:
    'Typography scales, colour palettes, spacing tokens, and icon sets that define how Equinor products look and feel.',
  to: '/foundation',
} satisfies IconCardProps

const COMPONENTS_CARD = {
  icon: widgets,
  title: 'Components',
  description:
    'Ready-to-use UI elements like buttons, inputs, dialogs, and more — with matching Figma and React implementations.',
} satisfies IconCardProps

export function DesignLanguage(): ReactNode {
  const docPath = useShownVersionDocPath()
  // "In progress" describes the Beta components, so the card for Latest goes
  // without it.
  const badge: IconCardProps['badge'] =
    useShownDocsVersion().name === 'current'
      ? { label: 'In progress', tone: 'accent' }
      : undefined
  const categories = [
    FOUNDATIONS_CARD,
    { ...COMPONENTS_CARD, to: docPath(DOCS.components), badge },
  ]
  return (
    <DocsSection
      title="Browse by category"
      subtitle="Explore the building blocks of EDS — from foundational styles to ready-made UI components."
    >
      <IconCardGrid layout="row">
        {categories.map((category) => (
          <IconCard key={category.title} {...category} />
        ))}
      </IconCardGrid>
    </DocsSection>
  )
}

/* ======================================
 *  RESOURCES
 * ====================================== */

export function Resources(): ReactNode {
  const docPath = useShownVersionDocPath()
  return (
    <DocsSection
      title="Resources"
      subtitle="Tools, libraries, and guides that support how you design and build with EDS."
      tone="muted"
    >
      <div className="docs-resource-grid">
        <Link to={docPath(DOCS.figma)} className="docs-resource-tile">
          <span className="docs-resource-tile__icon">
            <FigmaMark />
          </span>
          <div>
            <h3>EDS Figma Library</h3>
            <p>Set up access and start using EDS components in Figma.</p>
          </div>
        </Link>

        <Link
          to={storybookUrl}
          className="docs-resource-tile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="docs-resource-tile__icon">
            <StorybookMark />
          </span>
          <div>
            <h3>Storybook</h3>
            <p>Interactive component playground with live examples.</p>
          </div>
        </Link>

        <Link to={docPath(DOCS.support)} className="docs-resource-tile">
          <span className="docs-resource-tile__icon" data-tone="plain">
            <Icon data={help} />
          </span>
          <div>
            <h3>Support</h3>
            <p>
              Get help in #eds-design-system on Slack, or through the other
              channels.
            </p>
          </div>
        </Link>
      </div>

      <Link to={docPath(DOCS.resources)} className="docs-resources-footnote">
        See all resources
        <Icon data={arrow_forward} />
      </Link>
    </DocsSection>
  )
}

/* ======================================
 *  CONTRIBUTE
 * ====================================== */

export function Contribute(): ReactNode {
  return (
    <CtaSection
      title="Shape the system"
      cta={{ label: 'Start contributing', to: githubUrl }}
    >
      EDS is built by the teams that use it. Report issues, suggest
      improvements, or contribute code and design. Every contribution helps the
      whole organisation.
    </CtaSection>
  )
}

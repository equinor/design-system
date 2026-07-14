import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import {
  puzzle,
  accessible,
  touch,
  desktop_mac,
  color_palette,
  widgets,
  view_module,
  help,
  arrow_forward,
} from '@equinor/eds-icons'

import { Hero as PageHero } from '@site/src/components/Hero'
import { SectionHeading } from '@site/src/components/SectionHeading'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import type { IconCardProps } from '@site/src/components/IconCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { Icon } from '@site/src/components/Icon'
import { githubUrl, storybookUrl } from '@site/src/data/siteLinks'

import Designer from '../../../static/img/illustrations/designer_illu.svg'
import Devices from '../../../static/img/illustrations/devices_illu.svg'

import styles from './styles.module.css'

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

/* ======================================
 * 1. HERO
 * ====================================== */

export function Hero(): ReactNode {
  return (
    <PageHero
      eyebrow="Equinor Design System"
      title="Guidelines, tokens, and components for Equinor digital products"
      lead={
        <p>
          EDS is Equinor&rsquo;s official design system. It provides shared
          design tokens, UI components, and guidelines so teams can build
          consistent, accessible digital products without starting from scratch.
        </p>
      }
    >
      <div className={styles.entryGrid}>
        <Link
          to="docs/Next/about/getting-started/design/getting_started_design"
          className={styles.entryCard}
        >
          <Designer
            className={styles.entryCardIllustration}
            aria-hidden="true"
          />
          <div className={styles.entryCardContent}>
            <h3>Design</h3>
            <p>
              Set up the Figma libraries and start designing with EDS components
              and tokens.
            </p>
          </div>
        </Link>

        <Link
          to="docs/Next/about/getting-started/develop/getting_started_development"
          className={styles.entryCard}
        >
          <Devices
            className={styles.entryCardIllustration}
            aria-hidden="true"
          />
          <div className={styles.entryCardContent}>
            <h3>Develop</h3>
            <p>
              Install the packages and start building with React components and
              design tokens.
            </p>
          </div>
        </Link>
      </div>
    </PageHero>
  )
}

/* ======================================
 * 2. WHY EDS
 * ====================================== */

const PRINCIPLES = [
  {
    icon: puzzle,
    title: 'Flexible and adaptable',
    description:
      'Components work together seamlessly whilst accommodating diverse use cases across different projects.',
  },
  {
    icon: accessible,
    title: 'Accessible by design',
    description:
      'Inclusive design from the start. Every element supports assistive technologies and meets WCAG 2.1 AA.',
  },
  {
    icon: touch,
    title: 'Purposeful interaction',
    description:
      'Motion and interactive elements serve clear functions, helping users navigate without unnecessary decoration.',
  },
  {
    icon: desktop_mac,
    title: 'Cross-platform consistency',
    description:
      'Web, mobile, or desktop — EDS maintains the same visual language and interaction patterns everywhere.',
  },
] satisfies IconCardProps[]

export function WhyEds(): ReactNode {
  return (
    <section className="docs-section docs-section--muted">
      <div className="container">
        <SectionHeading
          title="Why EDS"
          subtitle="Principles that guide how EDS is built — and how it helps your team ship better products."
        />
        <IconCardGrid columns={4}>
          {PRINCIPLES.map((principle) => (
            <IconCard key={principle.title} {...principle} />
          ))}
        </IconCardGrid>
      </div>
    </section>
  )
}

/* ======================================
 * 3. BROWSE BY CATEGORY
 * ====================================== */

const CATEGORIES = [
  {
    icon: color_palette,
    title: 'Foundations',
    description:
      'Typography scales, colour palettes, spacing tokens, and icon sets that define how Equinor products look and feel.',
    to: '/foundation',
  },
  {
    icon: widgets,
    title: 'Components',
    description:
      'Ready-to-use UI elements like buttons, inputs, dialogs, and more — with matching Figma and React implementations.',
    to: 'docs/Next/components',
    badge: { label: 'In progress', tone: 'accent' },
  },
  {
    icon: view_module,
    title: 'Patterns',
    description:
      'Guidance on how to combine components for common tasks like forms, navigation, and data display.',
    badge: { label: 'Coming soon' },
    disabled: true,
  },
] satisfies IconCardProps[]

export function DesignLanguage(): ReactNode {
  return (
    <section className="docs-section">
      <div className="container">
        <SectionHeading
          title="Browse by category"
          subtitle="Explore the building blocks of EDS — from foundational styles to ready-made UI components."
        />
        <IconCardGrid columns={3}>
          {CATEGORIES.map((category) => (
            <IconCard key={category.title} {...category} />
          ))}
        </IconCardGrid>
      </div>
    </section>
  )
}

/* ======================================
 * 4. RESOURCES
 * ====================================== */

export function Resources(): ReactNode {
  return (
    <section className="docs-section docs-section--muted">
      <div className="container">
        <SectionHeading
          title="Resources"
          subtitle="Tools, libraries, and guides that support how you design and build with EDS."
        />
        <div className={styles.resourceGrid}>
          <Link
            to="docs/Next/about/getting-started/design/figma"
            className={styles.resourceTile}
          >
            <span className={styles.tileIconBrand}>
              <FigmaMark />
            </span>
            <div>
              <h3>EDS Figma Library</h3>
              <p>Set up access and start using EDS components in Figma.</p>
            </div>
          </Link>

          <Link
            to={storybookUrl}
            className={styles.resourceTile}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.tileIconBrand}>
              <StorybookMark />
            </span>
            <div>
              <h3>Storybook</h3>
              <p>Interactive component playground with live examples.</p>
            </div>
          </Link>

          <Link to="docs/Next/support" className={styles.resourceTile}>
            <span className={styles.tileIconPlain}>
              <Icon data={help} />
            </span>
            <div>
              <h3>Support</h3>
              <p>Get help through Slack, Teams, or other channels.</p>
            </div>
          </Link>
        </div>

        <Link to="docs/Next/resources" className={styles.resourcesFootnote}>
          See all resources
          <Icon data={arrow_forward} />
        </Link>
      </div>
    </section>
  )
}

/* ======================================
 * 5. CONTRIBUTE
 * ====================================== */

export function Contribute(): ReactNode {
  return (
    <CtaSection
      title="Shape the system"
      cta={{ label: 'Start contributing', to: githubUrl }}
      tone="muted"
    >
      EDS is built by the teams that use it. Report issues, suggest
      improvements, or contribute code and design. Every contribution helps the
      whole organisation.
    </CtaSection>
  )
}

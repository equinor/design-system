import type { ReactNode } from 'react'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'

import Designer from '../../../static/img/illustrations/designer_illu.svg'
import Devices from '../../../static/img/illustrations/devices_illu.svg'

import styles from './styles.module.css'

const ArrowForward = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.inlineArrow}>
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
)

/* ======================================
 * 1. HERO
 * ====================================== */

export function Hero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className="container">
        <span className={styles.heroEyebrow}>Equinor Design System</span>
        <Heading as="h1" className={styles.heroTitle}>
          Guidelines, tokens, and components for Equinor digital products
        </Heading>
        <p className={styles.heroBody}>
          EDS is Equinor&rsquo;s official design system. It provides shared
          design tokens, UI components, and guidelines so teams can build
          consistent, accessible digital products without starting from scratch.
        </p>

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
              <Heading as="h3">Design</Heading>
              <p>
                Set up the Figma libraries and start designing with EDS
                components and tokens.
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
              <Heading as="h3">Develop</Heading>
              <p>
                Install the packages and start building with React components
                and design tokens.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ======================================
 * 2. WHY EDS
 * ====================================== */

export function WhyEds(): ReactNode {
  return (
    <section className={styles.whyEds}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Why EDS
        </Heading>
        <p className={styles.sectionSubtitle}>
          Principles that guide how EDS is built — and how it helps your team
          ship better products.
        </p>
        <div className={styles.fourColGrid}>
          <div className={styles.principleCard}>
            <div className={styles.tileIconWrapper}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
              </svg>
            </div>
            <Heading as="h3">Flexible and adaptable</Heading>
            <p>
              Components work together seamlessly whilst accommodating diverse
              use cases across different projects.
            </p>
          </div>
          <div className={styles.principleCard}>
            <div className={styles.tileIconWrapper}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </div>
            <Heading as="h3">Accessible by design</Heading>
            <p>
              Inclusive design from the start. Every element supports assistive
              technologies and meets WCAG 2.1 AA.
            </p>
          </div>
          <div className={styles.principleCard}>
            <div className={styles.tileIconWrapper}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z" />
              </svg>
            </div>
            <Heading as="h3">Purposeful interaction</Heading>
            <p>
              Motion and interactive elements serve clear functions, helping
              users navigate without unnecessary decoration.
            </p>
          </div>
          <div className={styles.principleCard}>
            <div className={styles.tileIconWrapper}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" />
              </svg>
            </div>
            <Heading as="h3">Cross-platform consistency</Heading>
            <p>
              Web, mobile, or desktop — EDS maintains the same visual language
              and interaction patterns everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================================
 * 3. BROWSE BY CATEGORY
 * ====================================== */

export function DesignLanguage(): ReactNode {
  return (
    <section className={styles.designLanguage}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Browse by category
        </Heading>
        <p className={styles.sectionSubtitle}>
          Explore the building blocks of EDS — from foundational styles to
          ready-made UI components.
        </p>

        <div className={styles.bentoGrid}>
          <Link to="docs/Next/foundation" className={styles.bentoCard}>
            <div className={styles.bentoTopRow}>
              <div className={styles.bentoIconWrapper}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
            </div>
            <Heading as="h3">Foundations</Heading>
            <p>
              Typography scales, colour palettes, spacing tokens, and icon sets
              that define how Equinor products look and feel.
            </p>
            <span className={styles.bentoArrow}>
              <ArrowForward />
            </span>
          </Link>

          <Link to="docs/Next/components" className={styles.bentoCard}>
            <div className={styles.bentoTopRow}>
              <div className={styles.bentoIconWrapper}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
                </svg>
              </div>
              <span className={styles.statusBadge} data-tone="accent">
                In progress
              </span>
            </div>
            <Heading as="h3">Components</Heading>
            <p>
              Ready-to-use UI elements like buttons, inputs, dialogs, and more —
              with matching Figma and React implementations.
            </p>
            <span className={styles.bentoArrow}>
              <ArrowForward />
            </span>
          </Link>

          <div className={styles.bentoCard} data-disabled>
            <div className={styles.bentoTopRow}>
              <div className={styles.bentoIconWrapper}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" />
                </svg>
              </div>
              <span className={styles.statusBadge}>Coming soon</span>
            </div>
            <Heading as="h3">Patterns</Heading>
            <p>
              Guidance on how to combine components for common tasks like forms,
              navigation, and data display.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ======================================
 * 4. RESOURCES
 * ====================================== */

export function Resources(): ReactNode {
  return (
    <section className={styles.resources}>
      <div className="container">
        <Heading as="h2">Resources</Heading>
        <p className={styles.resourcesSubtitle}>
          Tools, libraries, and guides that support how you design and build
          with EDS.
        </p>
        <div className={styles.resourceGrid}>
          <Link
            to="docs/Next/about/getting-started/design/figma"
            className={styles.resourceTile}
          >
            <div className={styles.tileIconBrand}>
              <svg viewBox="0 0 38 57" aria-hidden="true">
                <path
                  d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"
                  fill="#1ABCFE"
                />
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
            </div>
            <div>
              <Heading as="h3">EDS Figma Library</Heading>
              <p>Set up access and start using EDS components in Figma.</p>
            </div>
          </Link>

          <Link
            to="https://storybook.eds.equinor.com"
            className={styles.resourceTile}
          >
            <div className={styles.tileIconBrand}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M16.34.29l-.12 2.17a.18.18 0 0 0 .29.15l1.06-.8.9.7a.18.18 0 0 0 .28-.15L18.63.2l1.14-.08a1.12 1.12 0 0 1 1.2 1.06l.83 18.56a1.12 1.12 0 0 1-1.06 1.18L6.97 21.8a1.12 1.12 0 0 1-1.17-.97L4.34 2.07A1.12 1.12 0 0 1 5.31.9l11.03-.6zm-2.59 7.83c0 .45 2.78.23 3.15-.08 0-2.77-1.49-4.22-4.21-4.22-2.73 0-4.25 1.5-4.25 3.75 0 3.9 5.25 3.97 5.25 6.1 0 .58-.25 1.09-1.05 1.09-.95 0-1.35-.49-1.3-2.16 0-.35-3.2-.46-3.31 0-.23 3.54 1.96 4.57 4.64 4.57 2.6 0 4.43-1.39 4.43-3.9 0-4.18-5.36-4.05-5.36-6.14 0-.8.56-1.1 1.08-1.1.56 0 1.1.17.93 2.09z"
                  fill="#FF4785"
                />
              </svg>
            </div>
            <div>
              <Heading as="h3">Storybook</Heading>
              <p>Interactive component playground with live examples.</p>
            </div>
          </Link>

          <Link to="docs/Next/support/support" className={styles.resourceTile}>
            <div className={styles.tileIconWrapper}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
              </svg>
            </div>
            <div>
              <Heading as="h3">Support</Heading>
              <p>Get help through Slack, Teams, or other channels.</p>
            </div>
          </Link>
        </div>

        <Link to="docs/Next/resources" className={styles.resourcesFootnote}>
          See all resources
          <ArrowForward />
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
    <section className={styles.contribute}>
      <div className="container">
        <Heading as="h2">Shape the system</Heading>
        <p className={styles.contributeBody}>
          EDS is built by the teams that use it. Report issues, suggest
          improvements, or contribute code and design. Every contribution helps
          the whole organisation.
        </p>
        <Link
          to="https://www.github.com/equinor/design-system"
          className={styles.contributeCta}
        >
          Start contributing
        </Link>
      </div>
    </section>
  )
}

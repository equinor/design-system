import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'

import type { JSX, ReactNode } from 'react'

import styles from './foundation.module.css'

const ArrowForward = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
)

type TopicCardProps = {
  icon: ReactNode
  title: string
  description: string
  to: string
}

const TOPIC_CARDS: TopicCardProps[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
      </svg>
    ),
    title: 'Accessibility',
    description:
      'Guidelines for building inclusive digital interfaces that meet WCAG 2.1 AA requirements.',
    to: 'docs/Next/foundation/accessibility',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    title: 'Colour',
    description:
      'Colour palettes, semantic colour roles, and usage guidelines for consistent interfaces.',
    to: 'docs/Next/foundation/colour/intro',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.84L18 11v7h-2v-6H8v6H6v-7l6-5.16z" />
      </svg>
    ),
    title: 'Design Tokens',
    description:
      'Spacing, typography, elevation, shape, and grid tokens that power EDS components.',
    to: 'docs/Next/foundation/design-tokens/grid',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
      </svg>
    ),
    title: 'Data Visualisation',
    description:
      'Principles and guidelines for presenting data clearly through charts and graphs.',
    to: 'docs/Next/foundation/datavisualisation',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
      </svg>
    ),
    title: 'Patterns',
    description:
      'Reusable design patterns and best practices for common UI scenarios.',
    to: 'docs/Next/foundation/patterns',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    ),
    title: 'Assets',
    description:
      'Icons, logos, illustrations, photography, and other visual resources.',
    to: 'docs/Next/foundation/assets/image_placeholder',
  },
]

function HeroSection(): ReactNode {
  return (
    <section className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Foundation
        </Heading>
        <p className={styles.heroBody}>
          The building blocks of EDS &mdash; colour, typography, spacing, and
          more. These foundations ensure visual consistency and accessibility
          across all Equinor digital products.
        </p>
      </div>
    </section>
  )
}

function TopicsSection(): ReactNode {
  return (
    <section className={styles.topics}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Explore the foundations
        </Heading>
        <p className={styles.sectionSubtitle}>
          Each topic covers the principles, tokens, and guidelines you need to
          design and build with EDS.
        </p>
        <div className={styles.topicGrid}>
          {TOPIC_CARDS.map((card) => (
            <Link key={card.title} to={card.to} className={styles.topicCard}>
              <div className={styles.topicIconWrapper}>{card.icon}</div>
              <Heading as="h3">{card.title}</Heading>
              <p>{card.description}</p>
              <span className={styles.topicArrow}>
                <ArrowForward />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Foundation(): JSX.Element {
  return (
    <Layout
      title="Foundation"
      description="Design foundations for Equinor Design System — colour, typography, spacing, accessibility, and more"
    >
      <main>
        <HeroSection />
        <TopicsSection />
      </main>
    </Layout>
  )
}

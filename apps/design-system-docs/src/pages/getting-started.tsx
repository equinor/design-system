import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'

import type { JSX, ReactNode } from 'react'

import styles from './getting-started.module.css'

const ArrowForward = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
)

type PathCardProps = {
  icon: ReactNode
  title: string
  description: string
  to: string
}

const PATH_CARDS: PathCardProps[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.97 13.52v-.04L18 2H6L2.03 13.48l-.01.02-.02.07A.997.997 0 0 0 2 14v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-.14-.03-.27-.03-.48zM6.93 4h10.14l3.07 9H15l-2 2H11l-2-2H3.86l3.07-9zM20 20H4v-5h4.76l2 2h2.48l2-2H20v5z" />
      </svg>
    ),
    title: 'Design',
    description:
      'Set up Figma libraries and start designing with EDS components and tokens.',
    to: 'docs/Next/about/getting-started/design/getting_started_design',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
      </svg>
    ),
    title: 'Develop',
    description:
      'Install the React library and start building with components and design tokens.',
    to: 'docs/Next/about/getting-started/develop/getting_started_development',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
    title: 'Citizen developer',
    description:
      'Use Power Platform templates and component libraries that follow EDS principles.',
    to: 'docs/Next/about/getting-started/develop/citizen_developers',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    title: 'Team lead',
    description:
      'Plan adoption, connect with the community, and guide your team through implementation.',
    to: 'docs/Next/about/getting-started/team_roles',
  },
]

function HeroSection(): ReactNode {
  return (
    <section className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Getting started
        </Heading>
        <p className={styles.heroBody}>
          Whether you&rsquo;re designing in Figma, developing with React, or
          building solutions with low-code tools — pick your path to get up and
          running with EDS.
        </p>
      </div>
    </section>
  )
}

function PathsSection(): ReactNode {
  return (
    <section className={styles.paths}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Choose your path
        </Heading>
        <p className={styles.sectionSubtitle}>
          Each guide is tailored to your role — jump straight into the resources
          and steps that matter most for your work.
        </p>
        <div className={styles.pathGrid}>
          {PATH_CARDS.map((card) => (
            <Link key={card.title} to={card.to} className={styles.pathCard}>
              <div className={styles.pathIconWrapper}>{card.icon}</div>
              <Heading as="h3">{card.title}</Heading>
              <p>{card.description}</p>
              <span className={styles.pathArrow}>
                <ArrowForward />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function NextStepsSection(): ReactNode {
  return (
    <section className={styles.nextSteps}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          What&rsquo;s next
        </Heading>
        <p className={styles.sectionSubtitle}>
          After you&rsquo;re comfortable with the basics, explore advanced
          topics like custom theming, contributing new components, or
          integrating EDS into existing projects.
        </p>
        <Link
          to="https://equinor.slack.com/channels/eds-design-system"
          className={styles.nextStepsCta}
        >
          Join us on Slack
        </Link>
      </div>
    </section>
  )
}

export default function GettingStarted(): JSX.Element {
  return (
    <Layout
      title="Getting started"
      description="Get up and running with Equinor Design System"
    >
      <main>
        <HeroSection />
        <PathsSection />
        <NextStepsSection />
      </main>
    </Layout>
  )
}

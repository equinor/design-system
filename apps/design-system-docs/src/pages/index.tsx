import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { HomepageFeatures } from '@site/src/components/HomepageFeatures'
import Heading from '@theme/Heading'

import styles from './index.module.css'

import type { JSX } from 'react'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}></div>
      </div>
    </header>
  )
}

function HomepageInfo() {
  return (
    <header className={styles.homepageInfo}>
      <div className="container">
        <p>
          The Equinor Design System (EDS) helps you build consistent, accessible
          digital products faster. Whether you're a developer, designer, or part
          of any team, EDS provides the tools you need to create quality user
          experiences.
        </p>
        <br />
        <Heading as="h2">What You Get</Heading>
        <p>
          Guidelines, design tokens, icons, and React components that work
          together seamlessly. No need to reinvent the wheel—focus on what makes
          your product unique.
        </p>
        <br />
        <Heading as="h2">How It Works</Heading>
        <p>
          Design in Figma using our libraries, then build with matching React
          components. From concept to production, everything stays consistent.
        </p>
        <br />
        <Heading as="h2">Get Involved</Heading>
        <p>
          Share feedback, report issues, or contribute improvements. Your input
          helps make EDS better for everyone.
        </p>
        <br />
        <Heading as="h2">Need Help?</Heading>
        <p>
          Explore our documentation, browse Storybook examples, or reach out
          through our support channels. We're here to help you succeed.
        </p>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageInfo />
      </main>
    </Layout>
  )
}

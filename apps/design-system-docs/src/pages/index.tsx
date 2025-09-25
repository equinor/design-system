import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { HomepageFeatures } from '@site/src/components/HomepageFeatures'
import Heading from '@theme/Heading'

import styles from './index.module.css'

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
          Equinor Design System (EDS) is the single source of truth for
          designing, prototyping, and building internal digital products at
          Equinor. It reduces duplication, increases quality, and accelerates
          delivery.
        </p>
        <Heading as="h4">Getting started</Heading>
        <p>
          Use our guidelines, tokens, icons, and React component libraries to
          assemble consistent, accessible, and efficient user interfaces—without
          reinventing patterns.
        </p>
        <Heading as="h4">Our foundation</Heading>
        <p>
          EDS focuses on usability, accessibility, clarity, performance, and
          long‑term maintainability to reduce complexity and improve user
          experience for everyone.
        </p>
        <p>
          Design tokens ensure visual consistency (spacing, color, typography,
          motion) and enable theming across platforms.
        </p>
        <Heading as="h4">Community driven</Heading>
        <p>
          The core team stewards the system, but its quality depends on adoption
          and contribution. Share needs, report issues, and propose
          improvements—feedback and contributions keep EDS healthy.
        </p>
        <p>You can:</p>
        <ul>
          <li>Open issues for gaps or bugs</li>
          <li>Request new components (with rationale and use cases)</li>
          <li>Contribute enhancements with tests and stories</li>
        </ul>
        <Heading as="h4">Design to production workflow</Heading>
        <p>
          Start in Figma with official EDS libraries, validate interactions,
          then implement using the matching React components and tokens.
        </p>
        <Heading as="h4">Need help?</Heading>
        <p>
          Reach out via the internal support channel, consult the component
          docs, or explore Storybook examples to learn established patterns
          before building new ones.
        </p>
        {/*         <div className={styles.videoGrid}>
          <iframe
            src="https://youtube.com/embed/M-G7JTp14Nw"
            title="What is a design system"
            allowFullScreen
          ></iframe>
          <iframe
            src="https://www.youtube.com/embed/5my0W735TF4"
            title="What makes working on EDS interesting"
            allowFullScreen
          ></iframe>
        </div> */}
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

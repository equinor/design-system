import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import {
  Hero,
  Intro,
  WhyEds,
  DesignLanguage,
  Resources,
  Contribute,
} from '@site/src/components/HomepageSections'

import type { JSX } from 'react'

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={siteConfig.title}
      description="Guidelines, tokens, and components for Equinor digital products"
    >
      <main>
        <Hero />
        <Intro />
        <WhyEds />
        <DesignLanguage />
        <Resources />
        <Contribute />
      </main>
    </Layout>
  )
}

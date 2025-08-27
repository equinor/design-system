import type { ReactNode } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import Heading from '@theme/Heading'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="https://loop.equinor.com/en/stories/eds-design-system"
          >
            Loop story - &apos;How it all began&apos;
          </Link>
        </div>
      </div>
    </header>
  )
}

function HomepageInfo() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Equinor Design System
        </Heading>
        <p className="hero__subtitle">
          The EDS is the official design system of Equinor and is to be used
          when designing, prototyping and developing internal digital
          interfaces.
        </p>
        <Heading as="h2" className="hero__subtitle">
          {' '}
          Getting started
        </Heading>
        <p className="hero__subtitle">
          EDS provides a collection of guidelines and reusable components that
          can be assembled in different combinations to design and build digital
          interfaces.
        </p>
        <Heading as="h2" className="hero__subtitle">
          {' '}
          Our Foundation
        </Heading>
        <p className="hero__subtitle">
          EDS&apos;s main goal is to enhance the usability for all users. ##
          Community based EDS relies on its users and the EDS core team
          maintains and provides support for you and are here to help. Don&apos
          ;t hesitate to contact us if you have any questions or feedback.{' '}
        </p>
        <Heading as="h2" className="hero__subtitle">
          {' '}
          Community Based
        </Heading>
        <p className="hero__subtitle">
          EDS relies on its users and the EDS core team maintains and provides
          support for you and are here to help. Don&apos;t hesitate to contact
          us if you have any questions or feedback.{' '}
        </p>
        <div className={styles.buttons}>
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
        </div>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <HomepageInfo />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}

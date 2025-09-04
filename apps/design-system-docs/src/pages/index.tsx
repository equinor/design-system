/* eslint-disable import/no-default-export */
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
        <Heading as="h2" className="hero__title">
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
    <header>
      <div className="container">
        <p>
          The EDS is the official design system of Equinor and is to be used
          when designing, prototyping and developing internal digital
          interfaces.
        </p>
        <Heading as="h4"> Getting started</Heading>
        <p>
          EDS provides a collection of guidelines and reusable components that
          can be assembled in different combinations to design and build digital
          interfaces.
        </p>
        <Heading as="h4"> Our Foundation</Heading>
        <p>EDS&apos;s main goal is to enhance the usability for all users.</p>
        <Heading as="h4"> Community Based</Heading>
        <p>
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
        <div className={clsx('hero')} style={{ justifyContent: 'center' }}>
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

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}`}
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

import Layout from '@theme/Layout'

import type { JSX } from 'react'

import { Hero } from '@site/src/components/Hero'
import { SectionHeading } from '@site/src/components/SectionHeading'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { gettingStartedPaths } from '@site/src/data/gettingStartedPaths'
import { slackUrl } from '@site/src/data/siteLinks'

export default function GettingStarted(): JSX.Element {
  return (
    <Layout
      title="Getting started"
      description="Get up and running with Equinor Design System"
    >
      <main>
        <Hero
          title="Getting started"
          lead={
            <p>
              Whether you&rsquo;re designing in Figma, developing with React, or
              building solutions with low-code tools &mdash; pick your path to
              get up and running with EDS.
            </p>
          }
        />
        <section className="docs-section">
          <div className="container">
            <SectionHeading
              title="Choose your path"
              subtitle="Each guide is tailored to your role — jump straight into the resources and steps that matter most for your work."
            />
            <IconCardGrid columns={4}>
              {gettingStartedPaths.map((path) => (
                <IconCard
                  key={path.title}
                  icon={path.icon}
                  title={path.title}
                  description={path.description}
                  to={path.to}
                />
              ))}
            </IconCardGrid>
          </div>
        </section>
        <CtaSection
          title="What's next"
          cta={{ label: 'Join us on Slack', to: slackUrl }}
          tone="muted"
        >
          After you&rsquo;re comfortable with the basics, explore advanced
          topics like custom theming, contributing new components, or
          integrating EDS into existing projects.
        </CtaSection>
      </main>
    </Layout>
  )
}

import Layout from '@theme/Layout'

import type { JSX } from 'react'

import { Hero } from '@site/src/components/Hero'
import { DocsSection } from '@site/src/components/DocsSection'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import { foundationTopics } from '@site/src/data/foundationNav'

export default function Foundation(): JSX.Element {
  return (
    <Layout
      title="Foundation"
      description="Design foundations for Equinor Design System — colour, typography, spacing, accessibility, and more"
    >
      <main>
        <Hero
          title="Foundation"
          lead={
            <p>
              The building blocks of EDS &mdash; colour, typography, spacing,
              and more. These foundations ensure visual consistency and
              accessibility across all Equinor digital products.
            </p>
          }
        />
        <DocsSection
          title="Explore the foundations"
          subtitle="Each topic covers the principles, tokens, and guidelines you need to design and build with EDS."
        >
          <IconCardGrid columns={3}>
            {foundationTopics.map((topic) => (
              <IconCard
                key={topic.label}
                icon={topic.icon}
                title={topic.label}
                description={topic.description}
                to={topic.to}
              />
            ))}
          </IconCardGrid>
        </DocsSection>
      </main>
    </Layout>
  )
}

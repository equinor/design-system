import Layout from '@theme/Layout'

import type { JSX } from 'react'

import { Hero } from '@site/src/components/Hero'
import { SectionHeading } from '@site/src/components/SectionHeading'
import { TeamCardGrid } from '@site/src/components/TeamCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { teamMembers } from '@site/src/data/team'
import { slackUrl } from '@site/src/data/siteLinks'

export default function About(): JSX.Element {
  return (
    <Layout
      title="About EDS"
      description="Meet the team behind Equinor Design System"
    >
      <main>
        <Hero
          title="About EDS"
          lead={
            <>
              <p>
                <strong>Equinor Design System</strong> is Equinor&rsquo;s
                official design system. We provide shared design tokens, UI
                components, and guidelines so teams can build consistent,
                accessible digital products without starting from scratch.
              </p>
              <p>
                We support the Equinor community through documentation,
                training, and collaboration. Your feedback helps us continuously
                improve EDS for everyone.
              </p>
            </>
          }
        />
        <section className="docs-section">
          <div className="container">
            <SectionHeading
              title="The Team"
              subtitle="We're a diverse team combining design, development, accessibility, and user experience expertise to maintain and evolve EDS. Working closely with Equinor's brand team, we ensure every component aligns with corporate identity."
            />
            <p className="docs-about-motto">
              From ideas to interfaces — we connect the dots.
            </p>
            <TeamCardGrid members={teamMembers} />
          </div>
        </section>
        <CtaSection
          title="Contact us"
          cta={{ label: 'Reach us on Slack', to: slackUrl }}
          tone="muted"
        >
          Visit our Support page for office hours, community channels, and
          direct contact information.
        </CtaSection>
      </main>
    </Layout>
  )
}

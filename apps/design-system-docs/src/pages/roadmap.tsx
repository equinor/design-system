import Layout from '@theme/Layout'

import type { JSX } from 'react'

import { Hero } from '@site/src/components/Hero'
import { DocsSection } from '@site/src/components/DocsSection'

export default function Roadmap(): JSX.Element {
  return (
    <Layout
      title="What we're doing"
      description="Where the Equinor Design System is heading. A high-level view of what the team is working on now and what is coming next."
    >
      <main>
        <Hero
          title="What we're doing"
          dots
          lead={
            <>
              <p>
                Where the Equinor Design System is heading. A high-level view of
                what the team is working on now and what is coming next.
              </p>
              <p>
                <em>Last updated: 26 October 2026.</em>
              </p>
            </>
          }
        />
        <DocsSection
          title="Working on now"
          subtitle="What the team is actively building this quarter."
        >
          <ul>
            <li>
              <strong>The 3.0.0 beta tokens</strong>: Publishing the colour,
              typography, spacing, sizing, elevation and theming tokens for the
              EDS 3.0.0 beta as the canonical source of truth.
            </li>
            <li>
              <strong>Token migration and adoption</strong>: Migrating the first
              component groups onto the 3.0.0 beta tokens as the reference
              implementation.
            </li>
            <li>
              <strong>Expanding the component ecosystem</strong>: Delivering
              more web and mobile component groups, each with documentation,
              Figma updates and quality assurance.
            </li>
          </ul>
        </DocsSection>
        <DocsSection title="Next" subtitle="Work we expect to pick up soon.">
          <ul>
            <li>
              <strong>AI-assisted design and development</strong>: Making
              components, documentation and patterns easy for people and AI
              tools to discover, understand and use.
            </li>
            <li>
              <strong>Adoption and community engagement</strong>: Growing
              awareness and trust in EDS through outreach, feedback loops,
              adoption insights and roadmap transparency.
            </li>
          </ul>
        </DocsSection>
        <DocsSection
          title="Exploring"
          subtitle="Directions beyond the current quarter, still to be firmed up."
        >
          <p>
            Beyond the current quarter, our direction is shaped by the same
            themes above: completing the mobile rollout, moving the remaining
            component groups onto the 3.0.0 beta tokens, and supporting broader
            adoption of the EDS 3.0.0 beta across Equinor. These are
            intentionally high level. We will firm them up into dated milestones
            as the current work lands.
          </p>
        </DocsSection>
        <DocsSection title="Recently shipped" tone="muted">
          <p>
            Delivered items will appear here as they ship. For every published
            change, with versions and dates, see the{' '}
            <a href="https://github.com/equinor/design-system/releases">
              release notes on GitHub
            </a>
            .
          </p>
        </DocsSection>
      </main>
    </Layout>
  )
}

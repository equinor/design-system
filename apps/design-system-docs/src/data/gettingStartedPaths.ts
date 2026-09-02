import { brush, code, apps, group } from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'

export type GettingStartedPath = {
  title: string
  description: string
  to: string
  icon: IconData
}

/** Role-based entry points for the Getting started landing page. */
export const gettingStartedPaths: GettingStartedPath[] = [
  {
    title: 'Design',
    description:
      'Set up Figma libraries and start designing with EDS components and tokens.',
    to: 'docs/Next/about/getting-started/design/getting_started_design',
    icon: brush,
  },
  {
    title: 'Develop',
    description:
      'Install the React library and start building with components and design tokens.',
    to: 'docs/Next/about/getting-started/develop/getting_started_development',
    icon: code,
  },
  {
    title: 'Citizen developer',
    description:
      'Use Power Platform templates and component libraries that follow EDS principles.',
    to: 'docs/Next/about/getting-started/develop/citizen_developers',
    icon: apps,
  },
  {
    title: 'Team lead',
    description:
      'Plan adoption, connect with the community, and guide your team through implementation.',
    to: 'docs/Next/about/getting-started/team_roles',
    icon: group,
  },
]

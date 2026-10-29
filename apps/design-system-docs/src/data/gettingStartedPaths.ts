import { brush, code, apps, group } from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import type { VersionedDocTarget } from '../utils/useShownVersionDocPath'

export type GettingStartedPath = VersionedDocTarget & {
  title: string
  description: string
  icon: IconData
}

/** Role-based entry points for the Getting started landing page. */
export const gettingStartedPaths: GettingStartedPath[] = [
  {
    title: 'Design',
    description:
      'Set up Figma libraries and start designing with EDS components and tokens.',
    docId: 'about/getting-started/design/getting_started_design',
    to: 'docs/about/getting-started/design/getting_started_design',
    icon: brush,
  },
  {
    title: 'Develop',
    description:
      'Install the React library and start building with components and design tokens.',
    docId: 'about/getting-started/develop/getting_started_development',
    to: 'docs/about/getting-started/develop/getting_started_development',
    icon: code,
  },
  {
    title: 'Citizen developer',
    description:
      'Use Power Platform templates and component libraries that follow EDS principles.',
    docId: 'about/getting-started/develop/citizen_developers',
    to: 'docs/about/getting-started/develop/citizen_developers',
    icon: apps,
  },
  {
    title: 'Team lead',
    description:
      'Plan adoption, connect with the community, and guide your team through implementation.',
    docId: 'about/getting-started/team_roles',
    to: 'docs/about/getting-started/team_roles',
    icon: group,
  },
]

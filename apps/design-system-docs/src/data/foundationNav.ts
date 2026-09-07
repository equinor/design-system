import {
  accessible,
  color_palette,
  tune,
  bar_chart,
  view_module,
  image,
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'

export type FoundationTopic = {
  label: string
  /** Doc id for Node contexts (docusaurus.config.ts navbar, sidebars.ts). */
  docId: string
  /** Client-side link target for `<Link>`/cards. */
  to: string
  description: string
  icon: IconData
}

/**
 * Single source of truth for the Foundation section. Drives the foundation
 * landing-page cards; wired into the navbar dropdown and sidebar in a later phase.
 */
export const foundationTopics: FoundationTopic[] = [
  {
    label: 'Accessibility',
    docId: 'foundation/accessibility',
    to: 'docs/Next/foundation/accessibility',
    description:
      'Guidelines for building inclusive digital interfaces that meet WCAG 2.1 AA requirements.',
    icon: accessible,
  },
  {
    label: 'Colour',
    docId: 'foundation/colour/intro',
    to: 'docs/Next/foundation/colour/intro',
    description:
      'Colour palettes, semantic colour roles, and usage guidelines for consistent interfaces.',
    icon: color_palette,
  },
  {
    label: 'Design Tokens',
    docId: 'foundation/design-tokens/grid',
    to: 'docs/Next/foundation/design-tokens/grid',
    description:
      'Spacing, typography, elevation, shape, and grid tokens that power EDS components.',
    icon: tune,
  },
  {
    label: 'Data Visualisation',
    docId: 'foundation/datavisualisation',
    to: 'docs/Next/foundation/datavisualisation',
    description:
      'Principles and guidelines for presenting data clearly through charts and graphs.',
    icon: bar_chart,
  },
  {
    label: 'Patterns',
    docId: 'foundation/patterns',
    to: 'docs/Next/foundation/patterns',
    description:
      'Reusable design patterns and best practices for common UI scenarios.',
    icon: view_module,
  },
  {
    label: 'Assets',
    docId: 'foundation/assets/image_placeholder',
    to: 'docs/Next/foundation/assets/image_placeholder',
    description:
      'Icons, logos, illustrations, photography, and other visual resources.',
    icon: image,
  },
]

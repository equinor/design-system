import {
  accessible,
  color_palette,
  tune,
  bar_chart,
  view_module,
  image,
} from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import type { VersionedDocTarget } from '../utils/useShownVersionDocPath'

export type FoundationTopic = VersionedDocTarget & {
  label: string
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
    to: 'docs/foundation/accessibility',
    description:
      'Guidelines for building inclusive digital interfaces that meet WCAG 2.1 AA requirements.',
    icon: accessible,
  },
  {
    label: 'Colour',
    docId: 'foundation/colour/intro',
    to: 'docs/foundation/colour/intro',
    description:
      'Colour palettes, semantic colour roles, and usage guidelines for consistent interfaces.',
    icon: color_palette,
  },
  {
    label: 'Design Tokens',
    docId: 'foundation/design-tokens/design-tokens',
    docIdByVersion: { '1.1.0': 'foundation/design-tokens/grid' },
    to: 'docs/foundation/design-tokens/grid',
    description:
      'Colour, spacing, typography, shape, and elevation tokens that power EDS components.',
    icon: tune,
  },
  {
    label: 'Data Visualisation',
    docId: 'foundation/datavisualisation',
    to: 'docs/foundation/datavisualisation',
    description:
      'Principles and guidelines for presenting data clearly through charts and graphs.',
    icon: bar_chart,
  },
  {
    label: 'Patterns',
    docId: 'foundation/patterns',
    to: 'docs/foundation/patterns',
    description:
      'Reusable design patterns and best practices for common UI scenarios.',
    icon: view_module,
  },
  {
    label: 'Assets',
    docId: 'foundation/assets/assets',
    docIdByVersion: { '1.1.0': 'foundation/assets/image_placeholder' },
    to: 'docs/foundation/assets/image_placeholder',
    description:
      'Icons, logos, illustrations, photography, and other visual resources.',
    icon: image,
  },
]

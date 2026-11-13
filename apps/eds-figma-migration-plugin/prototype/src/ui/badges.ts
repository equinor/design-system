import type { BadgeTone } from '@equinor/eds-core-react/next'
import type { Category } from '../../../src/scan/types'

/** The badge for each category, in the same colours as the health bar. */
export const BADGES: Record<
  Category,
  { tone: BadgeTone; emphasis: 'low' | 'medium' }
> = {
  migrated: { tone: 'success', emphasis: 'medium' },
  sure: { tone: 'info', emphasis: 'low' },
  check: { tone: 'warning', emphasis: 'medium' },
  byHand: { tone: 'warning', emphasis: 'low' },
  none: { tone: 'danger', emphasis: 'low' },
  excluded: { tone: 'neutral', emphasis: 'low' },
  inInstance: { tone: 'neutral', emphasis: 'low' },
  other: { tone: 'neutral', emphasis: 'low' },
}

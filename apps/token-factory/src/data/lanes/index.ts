// Lane registry. Display order matches insertion order — Dock iterates
// Object.values(LANES) for the lane indicator.
//
// Lane ids and labels match the actual Figma file names (verified by
// opening each file in Figma — eds-tokens-sync/CLAUDE.md's `Contents`
// column is approximate and has misled the workshop twice).
//
// G.6 corrected the naming. G.1 shipped only Static (ready); G.2 added
// locked placeholders for the other four; G.3 promoted foundations to
// scaffold with placeholder scenes.

import { FOUNDATIONS_LANE } from './foundations'
import { STATIC_LANE } from './static'
import { TYPOGRAPHY_LANE } from './typography'
import type { Lane, LaneId } from './types'

export type { Lane, LaneId, NarratorMode, SceneId, SceneRef } from './types'
export { PROLOGUE } from './prologue'
export { STATIC_LANE } from './static'
export { FOUNDATIONS_LANE } from './foundations'
export { TYPOGRAPHY_LANE } from './typography'

export const LANES: Record<LaneId, Lane> = {
  'colours-static': STATIC_LANE,
  foundations: FOUNDATIONS_LANE,
  'colours-dynamic': {
    id: 'colours-dynamic',
    label: 'colours · dynamic',
    accent: '--pico-dark-green',
    status: 'locked',
    scenes: [],
  },
  'st-primitives': {
    id: 'st-primitives',
    label: 's&t primitives',
    accent: '--pico-orange',
    status: 'locked',
    scenes: [],
  },
  'st-tokens': TYPOGRAPHY_LANE,
}

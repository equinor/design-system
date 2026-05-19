// Lane registry. Display order matches insertion order — Dock iterates
// Object.values(LANES) for the lane indicator.
//
// G.1 shipped only Static (ready) — the other four lane ids existed in
// the type but weren't populated. G.2 fills in placeholder entries with
// status:'locked' so the Dock can render the full 5-row indicator with
// correct dim/active styling regardless of which lane is selected.
//
// G.3 promotes one of the locked entries to status:'scaffold' and
// gives it a placeholder scene sequence.

import { FOUNDATIONS_LANE } from './foundations'
import { STATIC_LANE } from './static'
import type { Lane, LaneId } from './types'

export type { Lane, LaneId, NarratorMode, SceneId, SceneRef } from './types'
export { PROLOGUE } from './prologue'
export { STATIC_LANE } from './static'
export { FOUNDATIONS_LANE } from './foundations'

export const LANES: Record<LaneId, Lane> = {
  static: STATIC_LANE,
  foundations: FOUNDATIONS_LANE,
  dynamic: {
    id: 'dynamic',
    label: 'dynamic',
    accent: '--pico-dark-green',
    status: 'locked',
    scenes: [],
  },
  'spacing-primitives': {
    id: 'spacing-primitives',
    label: 'spacing primitives',
    accent: '--pico-orange',
    status: 'locked',
    scenes: [],
  },
  'spacing-modes': {
    id: 'spacing-modes',
    label: 'spacing modes',
    accent: '--pico-light-gray',
    status: 'locked',
    scenes: [],
  },
}

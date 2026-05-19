// Lane registry. Static is the only ready lane in G.1.
// G.3 adds a placeholder second lane. Other lanes stay locked.

import { STATIC_LANE } from './static'
import type { Lane, LaneId } from './types'

export type { Lane, LaneId, NarratorMode, SceneId, SceneRef } from './types'
export { PROLOGUE } from './prologue'
export { STATIC_LANE } from './static'

export const LANES: Partial<Record<LaneId, Lane>> = {
  static: STATIC_LANE,
}

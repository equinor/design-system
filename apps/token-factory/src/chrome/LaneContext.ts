// Lane state — split into two contexts:
//
//   LaneContext         — the currently selected lane (read-only)
//   LaneSelectionContext — { selectedLaneId, setSelectedLaneId }
//
// Two contexts so scenes that only need to read can subscribe without
// re-rendering when only the setter identity changes. Dock uses both:
// the lane indicator paints the active lane and calls setSelectedLaneId
// when the driver clicks a different lane label.

import { createContext, useContext } from 'react'
import { STATIC_LANE, type Lane, type LaneId } from '../data/lanes'

export const LaneContext = createContext<Lane>(STATIC_LANE)

export type LaneSelection = {
  selectedLaneId: LaneId
  setSelectedLaneId: (id: LaneId) => void
}

export const LaneSelectionContext = createContext<LaneSelection>({
  selectedLaneId: 'colours-static',
  setSelectedLaneId: () => {},
})

export const useLane = (): Lane => useContext(LaneContext)
export const useLaneSelection = (): LaneSelection =>
  useContext(LaneSelectionContext)

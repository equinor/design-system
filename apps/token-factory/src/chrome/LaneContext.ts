// LaneContext exposes the currently-selected lane to any scene that
// wants to read lane-specific content (label, accent, future
// per-lane protagonist data).
//
// Default is the Static lane — scenes that don't opt into the provider
// still get a sensible value.

import { createContext, useContext } from 'react'
import { STATIC_LANE, type Lane } from '../data/lanes'

export const LaneContext = createContext<Lane>(STATIC_LANE)

export const useLane = (): Lane => useContext(LaneContext)

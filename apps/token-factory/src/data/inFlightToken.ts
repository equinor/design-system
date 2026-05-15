// In-flight token state model.
//
// Phase 2 stands this up as structure-only: future phases (3+) mutate it
// as the token passes through each station. The conveyor visualisation
// doesn't depend on this state yet — it just represents the *shape* of
// the data the factory will carry.

export type StationId =
  | 'sync'
  | 'reference'
  | 'transform'
  | 'format'
  | 'bundle'
  | 'darkScope'

export type InFlightToken = {
  /** What entered the factory at Sync Dock (a Figma JSON leaf). */
  initial: {
    path: string
    value: string
  }
  /** Current shape after passing through some stations. */
  current: {
    name: string
    value: string
  }
  /** Stations the token has passed through, in order. */
  history: Array<{ station: StationId; note: string }>
}

export function createToken(initial: InFlightToken['initial']): InFlightToken {
  return {
    initial,
    current: { name: initial.path, value: initial.value },
    history: [],
  }
}

// Sample token used by Phase 2's empty-conveyor demo.
export const samplePalette = createToken({
  path: 'Light.Gray.2',
  value: '#ffffff',
})

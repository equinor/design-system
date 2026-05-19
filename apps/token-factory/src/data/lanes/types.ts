// Lane + scene types for the multi-lane architecture (Phase G).
//
// A Lane is a first-class story branch: one of the five Figma files that
// eds-tokens-sync drops at the goods terminal. Each lane carries its own
// scene sequence after the shared prologue (intro + dock).
//
// G.1 ships the types + the Static lane only. G.3 adds a placeholder
// second lane. Other lanes stay 'locked'.

export type LaneId =
  | 'static'
  | 'foundations'
  | 'dynamic'
  | 'spacing-primitives'
  | 'design-tokens'

// Scene id is the registry key — see data/sceneRegistry.ts. Kept as a
// string union for autocomplete; extend when adding new scene components.
export type SceneId =
  | 'intro'
  | 'dock'
  | 'inside'
  | 'crack'
  | 'reveal'
  | 'peel'
  | 'cutting'
  | 'tray'
  | 'packaging'
  | 'jeweller'
  // Generic placeholder — used by every scaffold lane until real
  // scene components land. One component, many scene-ref instances.
  | 'placeholder'

export type NarratorMode = 'corner' | 'centered'

export type SceneRef = {
  id: SceneId
  title: string
  lines: string[]
  /** Narrator overlay position. Defaults to 'corner' (top-right). */
  narrator?: NarratorMode
}

export type Lane = {
  id: LaneId
  label: string
  /** CSS variable name for this lane's accent (used by G.4 theming). */
  accent: string
  status: 'ready' | 'scaffold' | 'locked'
  /** Post-Dock scene sequence. Excludes the shared prologue. */
  scenes: SceneRef[]
}

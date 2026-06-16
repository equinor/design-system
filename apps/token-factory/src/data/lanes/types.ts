// Lane + scene types for the multi-lane architecture (Phase G).
//
// A Lane is a first-class story branch: one of the five Figma files that
// eds-tokens-sync drops at the goods terminal. Each lane carries its own
// scene sequence after the shared prologue (intro + dock).

// Five Figma files map to five lane ids. The id corresponds to the file's
// actual name in Figma (verified directly — eds-tokens-sync/CLAUDE.md's
// `Contents` column has been wrong about both naming and scope, twice).
//
//   colours-static    → 🎨 EDS Colours (static)
//   foundations       → EDS Foundations (Internal)
//   colours-dynamic   → 🎨 EDS Colours (dynamic)
//   st-primitives     → 🅰️ Spacing & Typography Primitives
//   st-tokens         → 🅰️ EDS Spacing & Typography tokens
export type LaneId =
  | 'colours-static'
  | 'foundations'
  | 'colours-dynamic'
  | 'st-primitives'
  | 'st-tokens'

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
  // Typography lane (st-tokens, foundry frame). Built scene-by-scene;
  // unbuilt scenes route through 'placeholder' until their component
  // lands. 'assembly' is the validated payoff (H.1).
  | 'foundry-inside'
  | 'billet'
  | 'master-gauge'
  | 'milling'
  | 'density-dial'
  | 'assembly'
  // Generic placeholder — used by every scaffold lane until real
  // scene components land. One component, many scene-ref instances.
  | 'placeholder'

export type NarratorMode = 'corner' | 'centered'

/** Visualization key for a lane-map cell. LaneMapDialog renders a
 * pixel-art icon per key. Keys are intentionally semantic (what the
 * step is) rather than visual (what it looks like). */
export type StageViz =
  | 'figma'
  | 'sync'
  | 'json'
  | 'crack'
  | 'layers'
  | 'cut'
  | 'file'
  | 'bundle'
  | 'ship'

/** A pipeline stage in a lane's lane-map overlay. Stages are the
 * abstract pipeline checkpoints the token passes through (sync, json,
 * cut, etc.) — distinct from scenes, which can group, expand or
 * subdivide stages narratively. Multiple scenes may share a stage. */
export type LaneStage = {
  id: string
  /** Short label drawn under the cell (~6 chars reads cleanly). */
  label: string
  /** Package or external system the work happens in. Used by the
   * lane-map dialog to show where each step lives. */
  pkg?: string
  /** Visualization key — maps to a renderer in LaneMapDialog. */
  viz?: StageViz
}

export type SceneRef = {
  id: SceneId
  title: string
  lines: string[]
  /** Narrator overlay position. Defaults to 'corner' (top-right). */
  narrator?: NarratorMode
  /** Which lane-map stage this scene parks the token at. Must match
   * one of the active lane's `stages[].id`. Scene authors set this so
   * LaneMap can light up the right station without consulting scene
   * components. */
  stage?: string
}

export type Lane = {
  id: LaneId
  label: string
  /** CSS variable name for this lane's accent (used by G.4 theming). */
  accent: string
  status: 'ready' | 'scaffold' | 'locked'
  /** Post-Dock scene sequence. Excludes the shared prologue. */
  scenes: SceneRef[]
  /** Optional pipeline-map stages. When defined, LaneMap renders the
   * stations across the top of the stage. Scenes opt-in by setting
   * their own `stage` to one of these ids. */
  stages?: LaneStage[]
}

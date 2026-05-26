// Shared prologue scenes: every lane sees these before branching.
// Intro frames the workshop; Dock is where the lane is selected.

import type { SceneRef } from './types'

export const PROLOGUE: SceneRef[] = [
  {
    id: 'intro',
    title: 'token factory',
    narrator: 'centered',
    lines: [
      'Welcome to the Token Factory.',
      'A short story about how a design token travels from Figma to the components your team ships.',
      'Press [space] to advance. Press [→] to jump scenes.',
    ],
  },
  {
    id: 'dock',
    title: 'the goods terminal',
    // Lane-map stage. Each lane that defines a `sync` stage will light
    // this station up during the dock scene. The colours-static lane
    // does; placeholder/locked lanes won't, so the map quietly hides.
    stage: 'sync',
    lines: [
      'Every morning, lorries arrive at our goods terminal.',
      "This is eds-tokens-sync — Figma's REST API drops variable files at our door.",
      "Our crate is labelled 'colours · static'. Click another lane label to follow that one instead.",
      'Five Figma files arrive each morning, one per lane.',
      'The worker reads the label and sorts our crate onto the matching belt.',
      'The gate slides open and our crate enters the factory.',
    ],
  },
]

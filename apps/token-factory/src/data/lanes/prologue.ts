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
    lines: [
      'Every morning, lorries arrive at our goods terminal.',
      "This is eds-tokens-sync — Figma's REST API drops variable files at our door.",
      "Our crate is labelled 'static'. That's our lane today.",
      'See the other four belts? Other lanes. Not today’s story.',
      'The worker reads the label and sorts our crate onto the static belt.',
      'The gate slides open and our crate enters the factory.',
    ],
  },
]

// Foundations lane — scaffold placeholder for Phase G.3.
//
// Architecturally proves that a second lane can carry its own scenes
// alongside Static. All four scenes route to the same PlaceholderScene
// component; the lane's narrative content is deliberately uncommitted
// here — real scene components and pedagogy land in a later phase.
//
// To promote this lane to 'ready' later: replace scenes' id with the
// real scene component ids, register those components in SCENES, and
// flip status to 'ready'.

import type { Lane } from './types'

export const FOUNDATIONS_LANE: Lane = {
  id: 'foundations',
  label: 'foundations',
  accent: '--pico-lavender',
  status: 'scaffold',
  scenes: [
    {
      id: 'placeholder',
      title: 'the loading bay',
      lines: [
        "You're now in a scaffolded lane.",
        'Scenes here are placeholders — the architecture supports any lane carrying its own story.',
        'Press → to step through the placeholders.',
      ],
    },
    {
      id: 'placeholder',
      title: 'the assembly line',
      lines: [
        'Real content for this lane lands in a future phase.',
        'For now the chrome confirms the lane swap worked end-to-end.',
      ],
    },
    {
      id: 'placeholder',
      title: 'the packing station',
      lines: [
        'Same scene-ref shape as the Static lane — just a different component behind the id.',
        'One PlaceholderScene component is reused across all of these scenes.',
      ],
    },
    {
      id: 'placeholder',
      title: 'the courier',
      lines: [
        "End of the scaffolded sequence — press → once more and you'll loop back to the intro.",
      ],
    },
  ],
}

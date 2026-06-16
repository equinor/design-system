// Scene registry. Maps a SceneId (the convention used by lane data) to
// the React component that renders that scene.
//
// Adding a new scene: drop the component under scenes/<lane>/, register
// it here, then reference its id from a lane's scenes array.

import type { FC } from 'react'
import { Intro } from '../scenes/intro/Intro'
import { Dock } from '../scenes/dock/Dock'
import { PlaceholderScene } from '../scenes/placeholder/PlaceholderScene'
import { Inside } from '../scenes/static/Inside'
import { Crack } from '../scenes/static/Crack'
import { Reveal } from '../scenes/static/Reveal'
import { Peel } from '../scenes/static/Peel'
import { Cutting } from '../scenes/static/Cutting'
import { Tray } from '../scenes/static/Tray'
import { Packaging } from '../scenes/static/Packaging'
import { Jeweller } from '../scenes/static/Jeweller'
import { FoundryInside } from '../scenes/typography/FoundryInside'
import { Billet } from '../scenes/typography/Billet'
import { MasterGauge } from '../scenes/typography/MasterGauge'
import { Milling } from '../scenes/typography/Milling'
import { DensityDial } from '../scenes/typography/DensityDial'
import { Assembly } from '../scenes/typography/Assembly'
import type { SceneId, SceneRef } from './lanes'

export type SceneProps = {
  activeBeatIdx: number
  /** The scene-ref currently driving this render. Scenes that need
   *  per-instance metadata (e.g. PlaceholderScene reading the title)
   *  consume it; most scenes ignore it. */
  scene: SceneRef
}

export const SCENES: Record<SceneId, FC<SceneProps>> = {
  intro: Intro,
  dock: Dock,
  inside: Inside,
  crack: Crack,
  reveal: Reveal,
  peel: Peel,
  cutting: Cutting,
  tray: Tray,
  packaging: Packaging,
  jeweller: Jeweller,
  'foundry-inside': FoundryInside,
  billet: Billet,
  'master-gauge': MasterGauge,
  milling: Milling,
  'density-dial': DensityDial,
  assembly: Assembly,
  placeholder: PlaceholderScene,
}

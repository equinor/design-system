import { useEffect, useState } from 'react'
import { Factory } from './Factory'
import { SyncDock } from './SyncDock'
import { ReferenceResolver } from './ReferenceResolver'
import { TransformBench } from './TransformBench'
import { FormatSplitter } from './FormatSplitter'
import { BundlerPress } from './BundlerPress'
import { DarkScopeRewriter } from './DarkScopeRewriter'
import { Showroom } from './Showroom'

export type Scene =
  | 'idle'
  | 'sync'
  | 'reference'
  | 'transform'
  | 'format'
  | 'bundle'
  | 'darkScope'
  | 'showroom'

const ORDER: Scene[] = [
  'idle',
  'sync',
  'reference',
  'transform',
  'format',
  'bundle',
  'darkScope',
  'showroom',
]

const NEXT_LABEL: Record<Scene, string> = {
  idle: 'enter sync dock',
  sync: 'reference resolver',
  reference: 'transform bench',
  transform: 'format splitter',
  format: 'bundler press',
  bundle: 'dark-scope rewriter',
  darkScope: 'showroom',
  showroom: 'back to floor',
}

export function Stage() {
  const [scene, setScene] = useState<Scene>('idle')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        setScene((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length])
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setScene(
          (s) => ORDER[(ORDER.indexOf(s) - 1 + ORDER.length) % ORDER.length],
        )
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {scene === 'idle' && <Factory />}
      {scene === 'sync' && <SyncDock />}
      {scene === 'reference' && <ReferenceResolver />}
      {scene === 'transform' && <TransformBench />}
      {scene === 'format' && <FormatSplitter />}
      {scene === 'bundle' && <BundlerPress />}
      {scene === 'darkScope' && <DarkScopeRewriter />}
      {scene === 'showroom' && <Showroom />}
      <div className="nav-hint">
        <span className="nav-key">[ space ]</span>
        <span className="nav-label">{NEXT_LABEL[scene]}</span>
      </div>
    </>
  )
}

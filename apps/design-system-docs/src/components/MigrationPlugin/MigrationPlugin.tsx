import type { ReactNode } from 'react'
import { useColorMode } from '@docusaurus/theme-common'
import useBaseUrl from '@docusaurus/useBaseUrl'
import ThemedImage from '@theme/ThemedImage'

import './migration-plugin.css'

/** Size of the demo page: the 480 × 720 window, its 40px title bar and a 1px border */
const DEMO_WIDTH = 482
const DEMO_HEIGHT = 762

/**
 * The images `pnpm run docs:sync` in the plugin writes: twice the 20rem the
 * docs show them at, with the demo's proportions. Keep `IMAGE_WIDTH` in step
 * with `WIDTH` in the plugin's scripts/docs-sync.mjs.
 */
const IMAGE_WIDTH = 640
const IMAGE_HEIGHT = 1012

export type PluginWindowImageProps = {
  /** Name of the demo step the image shows, such as `health` */
  step: string
  /** What the window shows, for readers who cannot see the image */
  alt: string
}

/**
 * An image of the plugin window at one step, taken from the demo, in the
 * site's colour scheme.
 */
export function PluginWindowImage({ step, alt }: PluginWindowImageProps) {
  return (
    <ThemedImage
      className="docs-plugin-image"
      alt={alt}
      width={IMAGE_WIDTH}
      height={IMAGE_HEIGHT}
      loading="lazy"
      sources={{
        light: useBaseUrl(`/img/migration-plugin/${step}-light.webp`),
        dark: useBaseUrl(`/img/migration-plugin/${step}-dark.webp`),
      }}
    />
  )
}

PluginWindowImage.displayName = 'PluginWindowImage'

export type PluginStepProps = PluginWindowImageProps & {
  /** The text of the step, beside the image on wide screens */
  children: ReactNode
}

/** A step of the guide: the text, with an image of the window beside it */
export function PluginStep({ step, alt, children }: PluginStepProps) {
  return (
    <div className="docs-plugin-step">
      <div className="docs-plugin-step-text">{children}</div>
      <PluginWindowImage step={step} alt={alt} />
    </div>
  )
}

PluginStep.displayName = 'PluginStep'

/**
 * The plugin window running on a sample file, from the demo built in
 * apps/eds-figma-migration-plugin. It follows the site's colour scheme.
 */
export function PluginWindowDemo() {
  const { colorMode } = useColorMode()
  const src = useBaseUrl(`/migration-plugin/demo.html?theme=${colorMode}`)

  return (
    <iframe
      className="docs-plugin-demo"
      src={src}
      title="EDS Variable Migration window with a sample file"
      width={DEMO_WIDTH}
      height={DEMO_HEIGHT}
      loading="lazy"
    />
  )
}

PluginWindowDemo.displayName = 'PluginWindowDemo'

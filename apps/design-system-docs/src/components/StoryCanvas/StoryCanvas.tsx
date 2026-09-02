import type { ComponentType } from 'react'

import { storybookUrl } from '@site/src/data/siteLinks'

import { storyRegistry } from './stories'

import './story-canvas.css'

type StoryCanvasProps = {
  /** Registry path, e.g. `Button/AllVariants` (see ./stories.ts). */
  of: string
  /** Render a View-in-Storybook link under the canvas, derived from the story id. */
  showLink?: boolean
}

/**
 * Renders an actual Storybook story natively in the docs via portable
 * stories (composeStories) — no iframe, no hardcoded story id. Pilot
 * alternative to StorybookEmbed.
 */
export function StoryCanvas({ of, showLink = false }: StoryCanvasProps) {
  const [componentName, storyName] = of.split('/')
  const component = storyRegistry[componentName as keyof typeof storyRegistry]
  const Story = component?.[storyName as keyof typeof component] as
    (ComponentType & { id?: string }) | undefined

  if (!Story) {
    console.error(`StoryCanvas: unknown story "${of}"`)
    return null
  }

  return (
    <>
      <div className="docs-story-canvas">
        <Story />
      </div>
      {showLink && Story.id && (
        <p>
          <a
            href={`${storybookUrl}/?path=/story/${Story.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Storybook
          </a>
        </p>
      )}
    </>
  )
}

StoryCanvas.displayName = 'StoryCanvas'

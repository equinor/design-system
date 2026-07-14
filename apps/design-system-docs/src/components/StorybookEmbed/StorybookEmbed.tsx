import { storybookUrl } from '@site/src/data/siteLinks'

import type { StorybookEmbedProps } from './StorybookEmbed.types'

import './storybook-embed.css'

/**
 * Embeds a Storybook story as an iframe. Replaces the hand-written
 * `<iframe class="sb-iframe">` blocks and the `sbIframeNoScroll` client module
 * (scrolling is disabled here directly).
 */
export function StorybookEmbed({
  id,
  height = 88,
  title,
}: StorybookEmbedProps) {
  return (
    <iframe
      className="sb-iframe"
      src={`${storybookUrl}/iframe.html?globals=&args=&id=${id}`}
      title={title ?? id}
      width="100%"
      height={height}
      loading="lazy"
      scrolling="no"
    />
  )
}

StorybookEmbed.displayName = 'StorybookEmbed'

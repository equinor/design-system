/**
 * Disables scrollbars on all Storybook iframe embeds (.sb-iframe).
 * The iframes are cross-origin so we cannot style their internal document;
 * the `scrolling` HTML attribute is the only reliable way to suppress the
 * browser-rendered scrollbar.
 */

import type { ClientModule } from '@docusaurus/types'

const applyNoScroll = () => {
  document
    .querySelectorAll<HTMLIFrameElement>('iframe.sb-iframe')
    .forEach((iframe) => {
      iframe.setAttribute('scrolling', 'no')
    })
}

const module: ClientModule = {
  onRouteDidUpdate() {
    // Small delay to ensure iframes are in the DOM after MDX render
    setTimeout(applyNoScroll, 0)
  },
}

export default module

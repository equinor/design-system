/**
 * Bridges Docusaurus's `data-theme` attribute to EDS's `data-color-scheme`
 * attribute on <html>, so EDS design tokens (which key off
 * `[data-color-scheme="dark"]`) flip in lockstep with the Docusaurus theme
 * toggle. Without this, the page background follows the toggle but EDS-driven
 * surfaces stay light, producing low-contrast chips on a dark canvas.
 */

if (typeof document !== 'undefined') {
  const root = document.documentElement

  const sync = () => {
    const theme = root.getAttribute('data-theme')
    if (theme === 'dark' || theme === 'light') {
      root.setAttribute('data-color-scheme', theme)
    } else {
      root.removeAttribute('data-color-scheme')
    }
  }

  sync()

  new MutationObserver(sync).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
}

export {}

/**
 * Makes the Foundation dropdown label navigate to /foundation on click.
 *
 * Docusaurus renders dropdown navbar items as toggle buttons — clicking the
 * label opens/closes the menu instead of navigating. This module uses event
 * delegation to intercept clicks on the Foundation dropdown link and navigate
 * to its href, so hovering reveals the mega-menu while clicking goes to the
 * Foundation landing page.
 */

if (typeof document !== 'undefined') {
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as HTMLElement).closest?.<HTMLAnchorElement>(
        'a.foundation-dropdown[href]',
      )
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      e.preventDefault()
      e.stopPropagation()
      window.location.href = href
    },
    { capture: true },
  )
}

export {}

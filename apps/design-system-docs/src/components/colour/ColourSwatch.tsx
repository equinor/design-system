import React from 'react'

/**
 * A small painted square for the token reference table.
 *
 * Takes the CSS custom property without its `--eds-` prefix, so the generated rows stay short:
 * `<Swatch t="background-canvas" />`. The colour is a live `var()`, so it follows the colour scheme
 * and never needs regenerating.
 *
 * A chequerboard sits behind it, which only shows through `overlay.scrim` - the one token in the
 * set with alpha. Anywhere else it is hidden, and there it shows what the value actually does.
 */
export function ColourSwatch({ t }: { t: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '0.5rem',
        width: '1.25rem',
        height: '1.25rem',
        borderRadius: '3px',
        border: '1px solid var(--ifm-color-emphasis-300)',
        backgroundColor: `var(--eds-${t})`,
        backgroundImage:
          'linear-gradient(var(--eds-' +
          t +
          '), var(--eds-' +
          t +
          ')), repeating-conic-gradient(var(--ifm-color-emphasis-200) 0% 25%, transparent 0% 50%)',
        backgroundSize: '100% 100%, 8px 8px',
      }}
    />
  )
}

export default ColourSwatch

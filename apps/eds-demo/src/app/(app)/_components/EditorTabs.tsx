'use client'

import { useRef, type KeyboardEvent } from 'react'
import { cssFiles, type CssFile } from '../../../lib/preferences'

export const tabId = (file: CssFile) => `css-tab-${file}`

type EditorTabsProps = {
  current: CssFile
  onSelect: (file: CssFile) => void
}

/** One tab per CSS file, above the editor. Arrow keys, Home and End move
 * between the tabs and show the file at once (WAI-ARIA tabs pattern). */
export function EditorTabs({ current, onSelect }: EditorTabsProps) {
  const tabs = useRef(new Map<CssFile, HTMLButtonElement>())

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = cssFiles.indexOf(current)
    const last = cssFiles.length - 1
    const next =
      event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    onSelect(cssFiles[next])
    tabs.current.get(cssFiles[next])?.focus()
  }

  return (
    <div className="editor-tabs" role="tablist" aria-label="CSS files">
      {cssFiles.map((file) => (
        <button
          key={file}
          ref={(element) => {
            if (element) tabs.current.set(file, element)
          }}
          id={tabId(file)}
          type="button"
          role="tab"
          className="editor-tab"
          aria-selected={file === current}
          aria-controls="css-editor"
          tabIndex={file === current ? 0 : -1}
          onClick={() => onSelect(file)}
          onKeyDown={onKeyDown}
        >
          {file}.css
        </button>
      ))}
    </div>
  )
}

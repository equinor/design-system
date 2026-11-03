'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isToggleShortcut } from '../../../lib/messages'
import {
  colorSchemes,
  cssFiles,
  densities,
  modes,
  pick,
  readStorage,
  removeStorage,
  storageKeys,
  views,
  writeStorage,
  type ColorScheme,
  type CssFile,
  type Density,
  type Mode,
  type Sources,
  type View,
} from '../../../lib/preferences'
import { CssEditor, type CssEditorHandle } from './CssEditor'
import { EditorTabs, tabId } from './EditorTabs'
import { Frame } from './Frame'
import { RestartDialog } from './RestartDialog'
import { SPLIT, Splitter } from './Splitter'
import { Strip } from './Strip'
import { TOKEN_REFERENCE_ID, TokenReference } from './TokenReference'

type WorkbenchProps = {
  /** The CSS of the exercise and the solution as they are in the repo */
  sources: Sources
  tokenNames: string[]
}

type Settings = {
  mode: Mode
  file: CssFile
  view: View
  colorScheme: ColorScheme
  density: Density
  /** Whether the token reference is open */
  tokens: boolean
}

const defaults: Settings = {
  mode: 'exercise',
  file: 'page',
  view: 'row',
  colorScheme: 'light',
  density: 'comfortable',
  tokens: false,
}

type Splits = Record<'row' | 'column' | 'tokens', number>

function readSplit(name: keyof Splits) {
  const saved = Number(readStorage(storageKeys.split(name)))
  return saved >= SPLIT.min && saved <= SPLIT.max ? saved : SPLIT.initial
}

/** Reads what this browser saved: the CSS of every file and the settings.
 * The mode in the URL (#exercise or #solution) wins over the saved one. */
function restore(sources: Sources) {
  const texts = Object.fromEntries(
    modes.map((mode) => [
      mode,
      Object.fromEntries(
        cssFiles.map((file) => [
          file,
          readStorage(storageKeys.css(mode, file)) ?? sources[mode][file],
        ]),
      ),
    ]),
  ) as Sources
  const settings: Settings = {
    mode: pick(
      modes,
      window.location.hash.slice(1) || readStorage(storageKeys.mode),
      defaults.mode,
    ),
    file: pick(cssFiles, readStorage(storageKeys.file), defaults.file),
    view: pick(views, readStorage(storageKeys.view), defaults.view),
    colorScheme: pick(
      colorSchemes,
      readStorage(storageKeys.colorScheme),
      defaults.colorScheme,
    ),
    density: pick(
      densities,
      readStorage(storageKeys.density),
      defaults.density,
    ),
    tokens: readStorage(storageKeys.tokens) === 'open',
  }
  const splits: Splits = {
    row: readSplit('row'),
    column: readSplit('column'),
    tokens: readSplit('tokens'),
  }
  return { texts, settings, splits }
}

/** The tracks of the frame, the splitter and the editor: the frame's share
 * of the space from the splitter, side by side (Row) or stacked (Column). */
function splitStyle(view: View, splits: Splits) {
  if (view === 'fullscreen') return undefined
  const share = splits[view]
  return view === 'row'
    ? { gridTemplateColumns: tracks(share) }
    : { gridTemplateRows: tracks(share) }
}

/** Two parts and the splitter between them. */
const tracks = (share: number) =>
  `minmax(0, ${share}fr) auto minmax(0, ${1 - share}fr)`

/** The CSS the frame gets: every file of a mode, in order. */
const joined = (files: Record<CssFile, string>) =>
  cssFiles.map((file) => files[file]).join('\n\n')

function shortcutLabel() {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  return mac ? '⌘ ⇧ S' : 'Ctrl ⇧ S'
}

/** The editor app: the strip, the dashboard in its frame, and the CSS. */
export function Workbench({ sources, tokenNames }: WorkbenchProps) {
  const editor = useRef<CssEditorHandle>(null)
  const main = useRef<HTMLElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState<{
    texts: Sources
    shortcut: string
  } | null>(null)
  const [texts, setTexts] = useState<Sources>(sources)
  const [settings, setSettings] = useState<Settings>(defaults)
  const [splits, setSplits] = useState<Splits>({
    row: SPLIT.initial,
    column: SPLIT.initial,
    tokens: SPLIT.initial,
  })
  const [dragging, setDragging] = useState(false)
  const [restartOpen, setRestartOpen] = useState(false)
  // Not saved: inspecting blocks the dashboard, so it starts off.
  const [inspecting, setInspecting] = useState(false)

  // Storage and the URL only exist in the browser, so they are read after
  // the first render of the static page.
  useEffect(() => {
    const restored = restore(sources)
    setTexts(restored.texts)
    setSettings(restored.settings)
    setSplits(restored.splits)
    setLoaded({ texts: restored.texts, shortcut: shortcutLabel() })
  }, [sources])

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const toggleMode = useCallback(() => {
    setSettings((current) => ({
      ...current,
      mode: current.mode === 'exercise' ? 'solution' : 'exercise',
    }))
  }, [])

  // Settings are saved as they change; the mode is also put in the URL, so
  // a link opens the same CSS.
  useEffect(() => {
    if (!loaded) return
    writeStorage(storageKeys.mode, settings.mode)
    writeStorage(storageKeys.file, settings.file)
    writeStorage(storageKeys.view, settings.view)
    writeStorage(storageKeys.colorScheme, settings.colorScheme)
    writeStorage(storageKeys.density, settings.density)
    writeStorage(storageKeys.tokens, settings.tokens ? 'open' : 'closed')
    window.history.replaceState(null, '', `#${settings.mode}`)
  }, [settings, loaded])

  useEffect(() => {
    if (!loaded) return
    writeStorage(storageKeys.split('row'), String(splits.row))
    writeStorage(storageKeys.split('column'), String(splits.column))
    writeStorage(storageKeys.split('tokens'), String(splits.tokens))
  }, [splits, loaded])

  // The app around the frame follows the colour scheme too. It sits on
  // <html>, where the elevation shadows need it.
  useEffect(() => {
    if (loaded) {
      document.documentElement.dataset.colorScheme = settings.colorScheme
    }
  }, [settings.colorScheme, loaded])

  // The CSS is saved after a short pause in typing. A file that is back to
  // its original text is removed from storage.
  useEffect(() => {
    if (!loaded) return
    const timer = window.setTimeout(() => {
      for (const mode of modes) {
        for (const file of cssFiles) {
          if (texts[mode][file] === sources[mode][file]) {
            removeStorage(storageKeys.css(mode, file))
          } else {
            writeStorage(storageKeys.css(mode, file), texts[mode][file])
          }
        }
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [texts, sources, loaded])

  useEffect(() => {
    const onHashChange = () => {
      const mode = window.location.hash.slice(1)
      if (modes.some((each) => each === mode)) update('mode', mode as Mode)
    }
    // Ctrl/⌘ + Shift + S anywhere in the app, the editor included. The frame
    // sends the same shortcut as a message.
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isToggleShortcut(event)) return
      event.preventDefault()
      toggleMode()
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('keydown', onKeyDown, { capture: true })
    }
  }, [toggleMode, update])

  const onChange = useCallback((mode: Mode, file: CssFile, text: string) => {
    setTexts((current) => ({
      ...current,
      [mode]: { ...current[mode], [file]: text },
    }))
  }, [])

  // A class picked in the frame: show its first rule in the CSS.
  const onInspectPick = useCallback(
    (classes: string[]) => {
      const file = editor.current?.reveal(classes)
      if (file) update('file', file)
    },
    [update],
  )

  const restart = () => {
    const mode = settings.mode
    editor.current?.reset(mode, sources[mode])
    setTexts((current) => ({ ...current, [mode]: sources[mode] }))
    for (const file of cssFiles) removeStorage(storageKeys.css(mode, file))
    setRestartOpen(false)
  }

  return (
    <div className="workbench" data-view={settings.view}>
      <Strip
        mode={settings.mode}
        view={settings.view}
        colorScheme={settings.colorScheme}
        density={settings.density}
        shortcut={loaded?.shortcut ?? ''}
        onMode={(mode) => update('mode', mode)}
        onView={(view) => update('view', view)}
        onColorScheme={(scheme) => update('colorScheme', scheme)}
        onDensity={(density) => update('density', density)}
        inspecting={inspecting}
        onInspect={setInspecting}
        onRestart={() => setRestartOpen(true)}
      />
      {loaded && (
        <main
          ref={main}
          className="workbench-main"
          data-dragging={dragging || undefined}
          style={splitStyle(settings.view, splits)}
        >
          <Frame
            css={joined(texts[settings.mode])}
            colorScheme={settings.colorScheme}
            density={settings.density}
            view={settings.view}
            inspect={inspecting}
            onToggleMode={toggleMode}
            onInspectPick={onInspectPick}
          />
          {settings.view !== 'fullscreen' && (
            <Splitter
              orientation={settings.view === 'row' ? 'vertical' : 'horizontal'}
              value={splits[settings.view]}
              onChange={(value) => {
                const view = settings.view
                if (view !== 'fullscreen') {
                  setSplits((current) => ({ ...current, [view]: value }))
                }
              }}
              label="Resize the frame and the editor"
              onDragging={setDragging}
              container={main}
            />
          )}
          {/* The editor, its tabs and the token reference are always in the
              dark scheme, so the colour scheme switch does not change them. */}
          <section
            className="editor-panel"
            data-color-scheme="dark"
            aria-label={`CSS of the ${settings.mode}`}
          >
            <div
              ref={body}
              className="editor-body"
              style={
                settings.tokens
                  ? { gridTemplateColumns: tracks(splits.tokens) }
                  : undefined
              }
            >
              <div className="editor-files">
                <EditorTabs
                  current={settings.file}
                  onSelect={(file) => update('file', file)}
                />
                <CssEditor
                  ref={editor}
                  initial={loaded.texts}
                  mode={settings.mode}
                  file={settings.file}
                  labelledBy={tabId(settings.file)}
                  tokenNames={tokenNames}
                  onChange={onChange}
                />
              </div>
              {settings.tokens && (
                <Splitter
                  label="Resize the editor and the token reference"
                  orientation="vertical"
                  value={splits.tokens}
                  onChange={(value) =>
                    setSplits((current) => ({ ...current, tokens: value }))
                  }
                  onDragging={setDragging}
                  container={body}
                />
              )}
              <TokenReference
                open={settings.tokens}
                tokenNames={tokenNames}
                colorScheme={settings.colorScheme}
                density={settings.density}
                onInsert={(name) => editor.current?.insert(name)}
              />
            </div>
            <div className="editor-rail">
              <button
                type="button"
                className="rail-tab"
                aria-expanded={settings.tokens}
                aria-controls={TOKEN_REFERENCE_ID}
                onClick={() => update('tokens', !settings.tokens)}
              >
                Tokens
              </button>
            </div>
          </section>
        </main>
      )}
      <RestartDialog
        open={restartOpen}
        mode={settings.mode}
        onCancel={() => setRestartOpen(false)}
        onConfirm={restart}
      />
    </div>
  )
}

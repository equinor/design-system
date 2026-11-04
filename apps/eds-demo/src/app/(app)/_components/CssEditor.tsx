'use client'

import type { CompletionContext } from '@codemirror/autocomplete'
import { css, cssLanguage } from '@codemirror/lang-css'
import { EditorState, Prec, type StateEffect } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import {
  cssFiles,
  modes,
  type CssFile,
  type Mode,
  type Sources,
} from '../../../lib/preferences'
import { anchorAt, lineFor } from '../../../lib/switchPosition'

export type CssEditorHandle = {
  /** Replaces the CSS of every file in one mode, with fresh undo histories. */
  reset: (mode: Mode, texts: Record<CssFile, string>) => void
  /** Puts a token in the CSS at the cursor, and moves the focus there. */
  insert: (name: string) => void
  /** Finds the first rule for one of the class names in the current mode
   * and puts the cursor on it. Returns its file, for the tabs, or null when
   * no rule has the class. */
  reveal: (classes: string[]) => CssFile | null
}

type CssEditorProps = {
  /** The CSS of every file when the editor starts */
  initial: Sources
  mode: Mode
  file: CssFile
  /** The id of the tab that shows the current file */
  labelledBy: string
  tokenNames: string[]
  onChange: (mode: Mode, file: CssFile, text: string) => void
}

const key = (mode: Mode, file: CssFile) => `${mode}/${file}`

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The first line of a rule for the class: a rule for the class alone
 * first, then any top-level rule that names it. */
function ruleLine(doc: EditorState['doc'], name: string, alone: boolean) {
  const pattern = alone
    ? new RegExp(`^\\.${escape(name)}\\s*\\{\\s*$`)
    : new RegExp(`^\\S.*\\.${escape(name)}(?![\\w-]).*\\{\\s*$`)
  for (let number = 1; number <= doc.lines; number++) {
    if (pattern.test(doc.line(number).text)) return number
  }
  return null
}

/** The change that puts a token at the cursor. A selection is replaced. A
 * name being typed (--eds-sp) is completed. Inside var( only the name is
 * added, otherwise the whole var(). */
function insertToken(state: EditorState, name: string) {
  const { from, to } = state.selection.main
  const line = state.doc.lineAt(from)
  const before = state.sliceDoc(line.from, from)
  const after = state.sliceDoc(to, line.to)
  const typed = from === to ? (before.match(/--[\w-]*$/)?.[0] ?? '') : ''
  const start = from - typed.length
  const inVar = /var\(\s*$/.test(before.slice(0, before.length - typed.length))
  const closed = after.startsWith(')')
  const text = inVar ? `${name}${closed ? '' : ')'}` : `var(${name})`
  return {
    changes: { from: start, to, insert: text },
    selection: { anchor: start + text.length + (inVar && closed ? 1 : 0) },
    scrollIntoView: true,
    userEvent: 'input',
  }
}

/** Font, size and background. The syntax colours come from One Dark. The
 * editor sits in a part of the app that is always in the dark scheme, so
 * the background is the dark surface token, whatever the colour scheme of
 * the rest of the app. */
const look = Prec.highest(
  EditorView.theme({
    '&': {
      height: '100%',
      fontSize: '13px',
      backgroundColor: 'var(--eds-background-surface)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--eds-background-surface)',
      borderRight: '1px solid var(--eds-border-non-interactive-neutral-muted)',
    },
    '.cm-scroller': {
      fontFamily: 'var(--eds-font-family-mono), ui-monospace, monospace',
      lineHeight: '1.6',
    },
  }),
)

/** Completes token names: type --eds- (or press Ctrl + Space after --) to
 * list the published beta tokens. */
function tokenCompletion(names: string[]) {
  const options = names.map((label) => ({ label, type: 'variable' }))
  return cssLanguage.data.of({
    autocomplete: (context: CompletionContext) => {
      const word = context.matchBefore(/--[\w-]*/)
      if (!word || (word.from === word.to && !context.explicit)) return null
      return { from: word.from, options, validFor: /^--[\w-]*$/ }
    },
  })
}

export const CssEditor = forwardRef<CssEditorHandle, CssEditorProps>(
  function CssEditor(
    { initial, mode, file, labelledBy, tokenNames, onChange },
    ref,
  ) {
    const parent = useRef<HTMLDivElement>(null)
    const view = useRef<EditorView | null>(null)
    // One state per mode and file, so each keeps its own text, undo history
    // and selection, and the scroll position it was left at.
    const states = useRef(new Map<string, EditorState>())
    const scrolls = useRef(new Map<string, StateEffect<unknown>>())
    const shown = useRef({ mode, file })
    // Set when another file is revealed, so the editor takes the focus once
    // that file is shown.
    const focusOnSwitch = useRef(false)

    // The latest callback, so the editor does not have to be rebuilt.
    const handlers = useRef({ onChange })
    handlers.current = { onChange }

    const createState = useRef(
      (forMode: Mode, forFile: CssFile, text: string) =>
        EditorState.create({
          doc: text,
          extensions: [
            basicSetup,
            css(),
            tokenCompletion(tokenNames),
            oneDark,
            look,
            // The editor can be narrow, beside the token reference.
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                handlers.current.onChange(
                  forMode,
                  forFile,
                  update.state.doc.toString(),
                )
              }
            }),
          ],
        }),
    ).current

    useEffect(() => {
      if (!parent.current) return
      for (const each of modes) {
        for (const eachFile of cssFiles) {
          states.current.set(
            key(each, eachFile),
            createState(each, eachFile, initial[each][eachFile]),
          )
        }
      }
      view.current = new EditorView({
        state: states.current.get(key(shown.current.mode, shown.current.file)),
        parent: parent.current,
      })
      return () => view.current?.destroy()
      // The editor is created once; later changes go through its state.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      const editor = view.current
      const from = shown.current
      if (!editor || (from.mode === mode && from.file === file)) return

      const before = editor.state
      const hadFocus = editor.hasFocus
      states.current.set(key(from.mode, from.file), before)
      scrolls.current.set(key(from.mode, from.file), editor.scrollSnapshot())
      const next = states.current.get(key(mode, file))
      if (!next) return
      shown.current = { mode, file }

      if (from.file !== file) {
        // Another file: show it where it was left, or from the top. The
        // snapshot is applied after the new text is measured, so a long
        // file is not clamped to the height of the one before.
        editor.setState(next)
        editor.dispatch({
          effects:
            scrolls.current.get(key(mode, file)) ??
            EditorView.scrollIntoView(0, { y: 'start' }),
        })
        if (hadFocus || focusOnSwitch.current) editor.focus()
        focusOnSwitch.current = false
        return
      }

      // The same file in the other mode: keep your place, the same rule and
      // the same number of lines into it, at the same height in the editor.
      const head = before.selection.main.head
      const headLine = before.doc.lineAt(head)
      const scroller = editor.scrollDOM.getBoundingClientRect()
      const coords = editor.coordsAtPos(head)
      const cursorVisible =
        coords !== null &&
        coords.top >= scroller.top &&
        coords.bottom <= scroller.bottom
      const line = cursorVisible
        ? headLine.number
        : before.doc.lineAt(
            editor.lineBlockAtHeight(editor.scrollDOM.scrollTop).from,
          ).number
      const offsetFromTop =
        cursorVisible && coords ? coords.top - scroller.top : 0
      const column = cursorVisible ? head - headLine.from : 0

      editor.setState(next)
      const target = next.doc.line(
        lineFor(next.doc, anchorAt(before.doc, line), line),
      )
      const position = target.from + Math.min(column, target.length)
      editor.dispatch({
        selection: { anchor: position },
        effects: EditorView.scrollIntoView(position, {
          y: 'start',
          yMargin: offsetFromTop,
        }),
      })
      if (hadFocus) editor.focus()
    }, [mode, file])

    useImperativeHandle(ref, () => ({
      reset: (forMode, texts) => {
        for (const eachFile of cssFiles) {
          const fresh = createState(forMode, eachFile, texts[eachFile])
          states.current.set(key(forMode, eachFile), fresh)
          scrolls.current.delete(key(forMode, eachFile))
          const current = shown.current
          if (current.mode === forMode && current.file === eachFile) {
            view.current?.setState(fresh)
          }
        }
      },
      insert: (name) => {
        const editor = view.current
        if (!editor) return
        editor.dispatch(insertToken(editor.state, name))
        editor.focus()
      },
      reveal: (classes) => {
        const editor = view.current
        if (!editor) return null
        const current = shown.current
        const stateOf = (forFile: CssFile) =>
          forFile === current.file
            ? editor.state
            : states.current.get(key(current.mode, forFile))
        for (const alone of [true, false]) {
          for (const name of classes) {
            for (const forFile of cssFiles) {
              const state = stateOf(forFile)
              const number = state && ruleLine(state.doc, name, alone)
              if (!state || !number) continue
              const position = state.doc.line(number).from
              const scroll = EditorView.scrollIntoView(position, {
                y: 'start',
                yMargin: 24,
              })
              if (forFile === current.file) {
                editor.dispatch({
                  selection: { anchor: position },
                  effects: scroll,
                })
                editor.focus()
              } else {
                // Shown when the tabs switch to the file.
                states.current.set(
                  key(current.mode, forFile),
                  state.update({ selection: { anchor: position } }).state,
                )
                scrolls.current.set(key(current.mode, forFile), scroll)
                focusOnSwitch.current = true
              }
              return forFile
            }
          }
        }
        return null
      },
    }))

    return (
      <div
        ref={parent}
        id="css-editor"
        className="workbench-editor"
        role="tabpanel"
        aria-labelledby={labelledBy}
      />
    )
  },
)

/**
 * Revert frame and Convert on the main thread, against a stand-in for
 * `figma` with only the calls they make: the fixes from the review of the
 * pull request that added the plugin (2026-11-25). A typography revert puts
 * back the font and the values without a variable, and a revert that fails
 * leaves the text as it was, so it can be tried again; a failed import of a
 * legacy variable is tried again; a Manual fix says how to undo it; and a
 * conversion that fails removes the text layer it made.
 *
 * These files are typed with the Figma typings (tsconfig.plugin.json), and
 * the layers are plain objects with the fields the code reads.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getNewTextStyle } from '../../src/mapping/inventory'
import { convertTypography } from '../../src/plugin/apply/convert'
import {
  MANUAL_FIX_NOT_REVERTED,
  revertRoots,
} from '../../src/plugin/apply/revert'
import type { ConversionPlan } from '../../src/scan/apply-plan'
import type { BindingRecord } from '../../src/scan/types'
import { LOG_KEY, NAMESPACE } from '../../src/shared/changelog'
import type { LogEntry, LoggedTypography } from '../../src/shared/changelog'

const MIXED = Symbol('mixed')
const PAGE = { type: 'PAGE', id: '0:1', parent: null }

/** What the stand-in imports and loads, and what it is told to fail. */
type Stand = {
  imports: string[]
  failImports: Set<string>
  failFonts: Set<string>
}

let stand: Stand

beforeEach(() => {
  stand = { imports: [], failImports: new Set(), failFonts: new Set() }
  vi.unstubAllGlobals()
  vi.stubGlobal('figma', {
    mixed: MIXED,
    skipInvisibleInstanceChildren: true,
    commitUndo: () => undefined,
    loadFontAsync: (font: FontName) =>
      stand.failFonts.has(`${font.family} ${font.style}`)
        ? Promise.reject(new Error('Font not found'))
        : Promise.resolve(),
    getStyleByIdAsync: (id: string) =>
      Promise.resolve(id === 'S:beta' ? { key: 'beta-style' } : null),
    variables: {
      importVariableByKeyAsync: (key: string) => {
        stand.imports.push(key)
        return stand.failImports.has(key)
          ? Promise.reject(new Error('404'))
          : Promise.resolve({ id: `V:${key}`, key })
      },
    },
  })
})

/** Shared plugin data, as a layer keeps it. */
function pluginData(log: LogEntry[]) {
  const data = new Map<string, string>([
    [`${NAMESPACE}/${LOG_KEY}`, JSON.stringify(log)],
  ])
  return {
    getSharedPluginData: (namespace: string, key: string) =>
      data.get(`${namespace}/${key}`) ?? '',
    setSharedPluginData: (namespace: string, key: string, value: string) => {
      data.set(`${namespace}/${key}`, value)
    },
    log: () =>
      JSON.parse(data.get(`${NAMESPACE}/${LOG_KEY}`) || '[]') as LogEntry[],
  }
}

/** A text layer in an EDS Beta text style, which records what is set on it. */
function styledText(log: LogEntry[]) {
  const calls: unknown[][] = []
  const data = pluginData(log)
  const record =
    (name: string) =>
    (_start: number, _end: number, value: unknown): void => {
      calls.push([name, value])
    }
  const node = {
    id: '1:2',
    name: 'Label',
    type: 'TEXT',
    removed: false,
    parent: PAGE,
    characters: 'Hello',
    textStyleId: 'S:beta',
    getSharedPluginData: data.getSharedPluginData,
    setSharedPluginData: data.setSharedPluginData,
    getRangeAllFontNames: () => [{ family: 'Inter', style: 'Regular' }],
    setTextStyleIdAsync: (id: string) => {
      calls.push(['textStyle', id])
      node.textStyleId = id
      return Promise.resolve()
    },
    setRangeFontName: record('fontName'),
    setRangeFontSize: record('fontSize'),
    setRangeLineHeight: record('lineHeight'),
    setRangeLetterSpacing: record('letterSpacing'),
    setRangeParagraphSpacing: record('paragraphSpacing'),
    setRangeParagraphIndent: record('paragraphIndent'),
    setRangeTextCase: record('textCase'),
    setRangeTextDecoration: record('textDecoration'),
    setRangeBoundVariable: (
      _start: number,
      _end: number,
      field: string,
      variable: Variable,
    ) => {
      calls.push(['bind', field, variable.key])
    },
  }
  return { node: node as unknown as SceneNode, raw: node, calls, data }
}

const typography = (
  key: string,
  extra: Partial<LoggedTypography> = {},
): LogEntry => ({
  property: { type: 'typography' },
  old: {
    type: 'typography',
    fields: { fontSize: { key, name: 'Typography/Font size' } },
    font: { family: 'Inter', style: 'Medium' },
    ...extra,
  },
  new: { type: 'textStyle', key: 'beta-style', name: 'label/md/medium' },
  outcome: 'sure',
  rule: 'type/style',
  mappingVersion: 'test',
  at: '2026-11-25T12:00:00.000Z',
})

describe('Revert frame on a typography change', () => {
  it('puts back the font and the values without a variable, then binds the legacy variables', async () => {
    const text = styledText([
      typography('size-a1', {
        values: {
          fontSize: 14,
          lineHeight: { unit: 'PIXELS', value: 20 },
          letterSpacing: { unit: 'PERCENT', value: 0 },
          paragraphSpacing: 0,
          textCase: 'ORIGINAL',
        },
      }),
    ])
    const result = await revertRoots([text.node])
    expect(result).toMatchObject({ reverted: 1, failed: [] })
    expect(text.calls).toEqual([
      ['textStyle', ''],
      ['fontName', { family: 'Inter', style: 'Medium' }],
      ['fontSize', 14],
      ['lineHeight', { unit: 'PIXELS', value: 20 }],
      ['letterSpacing', { unit: 'PERCENT', value: 0 }],
      ['paragraphSpacing', 0],
      ['textCase', 'ORIGINAL'],
      // Last, so the variable wins over the number set on its field
      ['bind', 'fontSize', 'size-a1'],
    ])
    expect(text.data.log()).toEqual([])
  })

  it('puts back what an entry from before the values were logged has, without failing', async () => {
    const text = styledText([typography('size-old')])
    const result = await revertRoots([text.node])
    expect(result).toMatchObject({ reverted: 1, failed: [] })
    expect(text.calls).toEqual([
      ['textStyle', ''],
      ['fontName', { family: 'Inter', style: 'Medium' }],
      ['bind', 'fontSize', 'size-old'],
    ])
  })

  it('leaves the text in its style when a legacy variable cannot be imported, and tries the import again on the next Revert', async () => {
    const text = styledText([typography('size-a2')])
    stand.failImports.add('size-a2')
    const failed = await revertRoots([text.node])
    expect(failed.reverted).toBe(0)
    expect(failed.failed[0]?.message).toBe(
      'The legacy library is no longer available, so the binding cannot be put back.',
    )
    // Nothing changed: the style is on, and the change is still logged.
    expect(text.calls).toEqual([])
    expect(text.raw.textStyleId).toBe('S:beta')
    expect(text.data.log()).toHaveLength(1)

    // The library is enabled again: the import is tried again, not read
    // from the failed one.
    stand.failImports.delete('size-a2')
    const retried = await revertRoots([text.node])
    expect(retried).toMatchObject({ reverted: 1, failed: [] })
    expect(stand.imports.filter((key) => key === 'size-a2')).toHaveLength(2)
    expect(text.data.log()).toEqual([])
  })

  it('leaves the text in its style when the legacy font is missing', async () => {
    const text = styledText([typography('size-font')])
    stand.failFonts.add('Inter Medium')
    const result = await revertRoots([text.node])
    expect(result.failed).toHaveLength(1)
    expect(text.calls).toEqual([])
    expect(text.raw.textStyleId).toBe('S:beta')
  })
})

describe('Revert frame on a Manual fix', () => {
  /** A layer inside an instance that has its own log there. */
  function sizedLayer(entry: LogEntry) {
    const data = pluginData([entry])
    const instance = {
      type: 'INSTANCE',
      id: '5:1',
      parent: PAGE,
      overrides: [{ id: 'I5:1;2:3', overriddenFields: ['pluginData'] }],
    }
    const node = {
      id: 'I5:1;2:3',
      name: 'Icon',
      type: 'INSTANCE',
      removed: false,
      parent: instance,
      boundVariables: {},
      getSharedPluginData: data.getSharedPluginData,
      setSharedPluginData: data.setSharedPluginData,
      // Figma ignores a size variable bound inside an instance.
      setBoundVariable: () => undefined,
    }
    return { node: node as unknown as SceneNode, data }
  }

  const fix = (extra: Partial<LogEntry>): LogEntry => ({
    property: { type: 'field', field: 'width' },
    old: { type: 'variable', key: 'icon-size', name: 'Selectable/Icon size' },
    new: { type: 'variable', key: 'spacing-xl', name: 'spacing/xl' },
    outcome: 'confirmed',
    mappingVersion: 'test',
    at: '2026-11-25T12:00:00.000Z',
    ...extra,
  })

  it('says how to undo it in Figma, without trying, and keeps it in the log', async () => {
    const layer = sizedLayer(fix({ rule: 'instance/size-override' }))
    const result = await revertRoots([layer.node])
    expect(result.reverted).toBe(0)
    expect(result.failed.map((failure) => failure.message)).toEqual([
      MANUAL_FIX_NOT_REVERTED,
    ])
    expect(stand.imports).toEqual([])
    expect(layer.data.log()).toHaveLength(1)
  })

  it('says the same for a fix logged before rules were, once Figma does not take the size', async () => {
    const layer = sizedLayer(
      fix({
        old: { type: 'variable', key: 'icon-size-old', name: 'Icon size' },
        new: { type: 'value', value: 24 },
      }),
    )
    const result = await revertRoots([layer.node])
    expect(result.failed.map((failure) => failure.message)).toEqual([
      MANUAL_FIX_NOT_REVERTED,
    ])
  })
})

describe('Convert, when a step fails before the instance is removed', () => {
  const STYLE = 'body/md/default'

  function setUp(options: { main?: () => Promise<unknown>; log?: () => void }) {
    const style = getNewTextStyle(STYLE)
    if (!style) throw new Error(`${STYLE} is not in the inventory`)
    const source = {
      type: 'TEXT',
      characters: 'Total',
      textCase: 'ORIGINAL',
      fills: [],
      textAlignHorizontal: 'LEFT',
      textAlignVertical: 'TOP',
      textTruncation: 'DISABLED',
      textAutoResize: 'WIDTH_AND_HEIGHT',
    }
    const frame = {
      type: 'FRAME',
      id: '2:1',
      layoutMode: 'NONE',
      parent: PAGE,
      children: [] as unknown[],
      insertChild: vi.fn(),
    }
    const instance = {
      type: 'INSTANCE',
      id: '3:1',
      name: 'Typography',
      removed: false,
      parent: frame,
      visible: true,
      locked: false,
      opacity: 1,
      layoutPositioning: 'AUTO',
      x: 0,
      y: 0,
      width: 120,
      height: 20,
      constraints: { horizontal: 'MIN', vertical: 'MIN' },
      componentProperties: {},
      explicitVariableModes: {},
      layoutSizingHorizontal: 'HUG',
      layoutSizingVertical: 'HUG',
      isExposedInstance: false,
      findOne: () => source,
      getMainComponentAsync:
        options.main ?? (() => Promise.resolve({ key: 'typography' })),
      remove: vi.fn(() => {
        instance.removed = true
      }),
    }
    frame.children.push(instance)
    const data = new Map<string, string>()
    const text = {
      id: '9:1',
      type: 'TEXT',
      removed: false,
      height: 20,
      setTextStyleIdAsync: () => Promise.resolve(),
      resize: vi.fn(),
      remove: vi.fn(() => {
        text.removed = true
      }),
      getSharedPluginData: (namespace: string, key: string) =>
        data.get(`${namespace}/${key}`) ?? '',
      setSharedPluginData:
        options.log ??
        ((namespace: string, key: string, value: string) => {
          data.set(`${namespace}/${key}`, value)
        }),
    }
    const stub = figma as unknown as Record<string, unknown>
    stub.getNodeByIdAsync = (id: string) =>
      Promise.resolve(id === instance.id ? instance : null)
    stub.createText = () => text
    stub.importStyleByKeyAsync = (key: string) =>
      Promise.resolve({
        type: 'TEXT',
        id: 'S:new',
        key,
        name: STYLE,
        fontName: { family: style.fontFamily, style: style.fontStyle },
        textCase: 'ORIGINAL',
      })
    const plan = {
      convert: [
        {
          instanceId: instance.id,
          style: {
            record: { rule: 'type/style' } as BindingRecord,
            target: STYLE,
            outcome: 'sure',
          },
        },
      ],
      skipped: [],
    } as ConversionPlan
    return { plan, instance, text }
  }

  it('removes the new text layer when the main component cannot be read', async () => {
    const { plan, instance, text } = setUp({
      main: () => Promise.reject(new Error('The main component is gone.')),
    })
    const result = await convertTypography(plan)
    expect(result).toMatchObject({ converted: 0, caseIds: [] })
    expect(result.failed.map((failure) => failure.message)).toEqual([
      'The main component is gone.',
    ])
    expect(text.remove).toHaveBeenCalledTimes(1)
    expect(instance.remove).not.toHaveBeenCalled()
  })

  it('removes the new text layer when the change log cannot be written', async () => {
    const { plan, instance, text } = setUp({
      log: () => {
        throw new Error('The plugin data is too large.')
      },
    })
    const result = await convertTypography(plan)
    expect(result.converted).toBe(0)
    expect(text.remove).toHaveBeenCalledTimes(1)
    expect(instance.remove).not.toHaveBeenCalled()
  })

  it('keeps the text layer and removes the instance when every step works', async () => {
    const { plan, instance, text } = setUp({})
    const result = await convertTypography(plan)
    expect(result).toMatchObject({ converted: 1, failed: [] })
    expect(text.remove).not.toHaveBeenCalled()
    expect(instance.remove).toHaveBeenCalledTimes(1)
  })
})

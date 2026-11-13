/**
 * Applies the Ready changes in a scan: binds the new variables, applies the
 * text styles and sets the new modes, logs every change on its layer, and
 * clears a legacy mode once nothing below it uses a legacy variable. One
 * run is one step in Figma's undo history.
 */
import { NEW } from '../../mapping/inventory'
import { literalValue } from '../../mapping/literal'
import { isResetTarget, resetVariable } from '../../mapping/reset'
import { MAPPING_VERSION } from '../../mapping/version'
import {
  modesToKeep,
  parseModeTarget,
  planChanges,
} from '../../scan/apply-plan'
import type { PlannedChange } from '../../scan/apply-plan'
import { propertyLabel } from '../../scan/labels'
import type { Overrides } from '../../scan/mapping'
import type { BindingRecord } from '../../scan/types'
import type { LogEntry } from '../../shared/changelog'
import type { ChangeFailure, ApplyResult } from '../../shared/messages'
import { appendLog, logIsInherited } from './log'
import { resetLayer } from './reset'
import { LIBRARY_MISSING, Targets } from './targets'

export class LayerChanged extends Error {
  constructor() {
    super('The layer has changed since the scan. Scan again.')
  }
}

/**
 * Figma ignores a plugin that binds a variable to the width or height of a
 * layer inside an instance, without an error, so every bound field is read
 * back after it is set.
 */
export class NotBound extends Error {
  constructor() {
    super(
      'Figma does not let a plugin bind a variable here, such as the width or height of a layer inside an instance. Change it in Figma.',
    )
  }
}

/** Throws NotBound unless the field is now bound to the variable. */
export function expectBound(
  node: SceneNode,
  field: string,
  variable: Variable,
): void {
  const bound = (node.boundVariables ?? {}) as Record<string, unknown>
  if (aliasId(bound[field]) !== variable.id) throw new NotBound()
}

/** Loads fonts once per run; text cannot change without its fonts. */
export class Fonts {
  private readonly loaded = new Map<string, Promise<void>>()

  load(font: FontName): Promise<void> {
    const key = `${font.family}|${font.style}`
    let found = this.loaded.get(key)
    if (!found) {
      found = figma.loadFontAsync(font).catch(() => {
        throw new Error(
          `The font ${font.family} ${font.style} is not available, so the text cannot change.`,
        )
      })
      this.loaded.set(key, found)
    }
    return found
  }

  async loadText(node: TextNode, range?: [number, number]): Promise<void> {
    const length = node.characters.length
    const fonts =
      length === 0
        ? node.fontName === figma.mixed
          ? []
          : [node.fontName]
        : node.getRangeAllFontNames(range?.[0] ?? 0, range?.[1] ?? length)
    for (const font of fonts) await this.load(font)
  }
}

type Bindable = SceneNode & {
  boundVariables?: SceneNodeMixin['boundVariables']
  setBoundVariable: (
    field: VariableBindableNodeField,
    variable: Variable | null,
  ) => void
}

function aliasId(value: unknown): string | undefined {
  return typeof value === 'object' &&
    value !== null &&
    (value as { type?: unknown }).type === 'VARIABLE_ALIAS'
    ? (value as VariableAlias).id
    : undefined
}

/** The variable on the field a record is about, before any change. */
function fieldAlias(node: BaseNode, record: BindingRecord): string | undefined {
  if (record.property.type !== 'field') return undefined
  const bound = ((node as Bindable).boundVariables ?? {}) as Record<
    string,
    unknown
  >
  return aliasId(bound[record.property.field])
}

function expectOld(record: BindingRecord, currentId: string | undefined) {
  if (!record.oldVariable || currentId !== record.oldVariable.id) {
    throw new LayerChanged()
  }
}

function oldVariableLog(record: BindingRecord): LogEntry['old'] {
  if (!record.oldVariable) throw new LayerChanged()
  return {
    type: 'variable',
    key: record.oldVariable.key,
    name: record.oldVariable.name,
  }
}

/** Binds one variable or applies one text style, and returns the log entry. */
async function applyBinding(
  change: PlannedChange,
  node: SceneNode,
  targets: Targets,
  fonts: Fonts,
  at: string,
): Promise<LogEntry> {
  const { record, target, outcome } = change
  const { property } = record
  const entry = { property, outcome, mappingVersion: MAPPING_VERSION, at }

  // A Manual fix a designer accepted: the layer has been reset already
  // (resetLayer, once per layer), so this checks the size it now has.
  if (isResetTarget(target)) {
    if (property.type !== 'field') throw new LayerChanged()
    const now = fieldAlias(node, record)
    const name = resetVariable(target)
    if (name) {
      const variable = await targets.variable(name)
      if (now !== variable.id) {
        const size = (node as unknown as Record<string, unknown>)[
          property.field
        ]
        throw new Error(
          `The plugin reset the layer and swapped it back, but Figma did not keep ${name} on it: the size is ${String(size)}px ${now ? 'with another variable' : 'without a variable'}. Undo the run with Ctrl or Cmd+Z, or keep it; the value is a Manual fix again.`,
        )
      }
      return {
        ...entry,
        old: oldVariableLog(record),
        new: { type: 'variable', key: variable.key, name: variable.name },
      }
    }
    if (now !== undefined) {
      throw new Error(
        'The reset did not remove the legacy variable here. Scan again.',
      )
    }
    const value = (node as unknown as Record<string, unknown>)[property.field]
    return {
      ...entry,
      old: oldVariableLog(record),
      new: { type: 'value', value: typeof value === 'number' ? value : null },
    }
  }

  if (property.type === 'typography') {
    if (node.type !== 'TEXT') throw new LayerChanged()
    const style = await targets.textStyle(target)
    await fonts.loadText(node, property.range)
    await fonts.load(style.fontName)
    if (property.range) {
      const [start, end] = property.range
      if (end > node.characters.length) throw new LayerChanged()
      await node.setRangeTextStyleIdAsync(start, end, style.id)
    } else {
      await node.setTextStyleIdAsync(style.id)
    }
    return {
      ...entry,
      old: {
        type: 'typography',
        fields: record.oldFields ?? {},
        font: record.oldFont,
      },
      new: { type: 'textStyle', key: style.key, name: style.name },
    }
  }

  // A number without a variable, such as a border width: unbind the legacy
  // variable and set the number it resolved to.
  const literal = literalValue(target)
  if (literal !== undefined) {
    if (property.type !== 'field') throw new LayerChanged()
    const bindable = node as Bindable & Record<string, unknown>
    const bound = (bindable.boundVariables ?? {}) as Record<string, unknown>
    expectOld(record, aliasId(bound[property.field]))
    // Width and height have no setter. The layer keeps its size when the
    // variable is removed, which is how a size inside an instance changes.
    const keepsSize = property.field === 'width' || property.field === 'height'
    if (
      keepsSize &&
      (literal === null ||
        Math.abs(Number(bindable[property.field]) - literal) > 0.01)
    ) {
      throw new LayerChanged()
    }
    bindable.setBoundVariable(property.field as VariableBindableNodeField, null)
    if (!keepsSize) bindable[property.field] = literal
    return {
      ...entry,
      old: oldVariableLog(record),
      new: { type: 'value', value: literal },
    }
  }

  const variable = await targets.variable(target)
  const newLog = {
    type: 'variable' as const,
    key: variable.key,
    name: variable.name,
  }

  if (property.type === 'field') {
    const bindable = node as Bindable
    const bound = (bindable.boundVariables ?? {}) as Record<string, unknown>
    expectOld(record, aliasId(bound[property.field]))
    bindable.setBoundVariable(
      property.field as VariableBindableNodeField,
      variable,
    )
    expectBound(bindable, property.field, variable)
    return { ...entry, old: oldVariableLog(record), new: newLog }
  }

  if (property.type === 'paint') {
    if (node.type === 'TEXT') await fonts.loadText(node, property.range)
    const rebind = (paints: readonly Paint[]): Paint[] => {
      const paint = paints[property.index]
      if (paint?.type !== 'SOLID') throw new LayerChanged()
      expectOld(record, paint.boundVariables?.color?.id)
      const copy = [...paints]
      copy[property.index] = figma.variables.setBoundVariableForPaint(
        paint,
        'color',
        variable,
      )
      return copy
    }
    if (property.range) {
      if (node.type !== 'TEXT') throw new LayerChanged()
      const [start, end] = property.range
      if (end > node.characters.length) throw new LayerChanged()
      const paints = node.getRangeFills(start, end)
      if (paints === figma.mixed) throw new LayerChanged()
      node.setRangeFills(start, end, rebind(paints))
    } else {
      const holder = node as SceneNode & Record<'fills' | 'strokes', unknown>
      const paints = holder[property.field]
      if (!Array.isArray(paints)) throw new LayerChanged()
      holder[property.field] = rebind(paints as Paint[])
    }
    return { ...entry, old: oldVariableLog(record), new: newLog }
  }

  if (property.type === 'effect') {
    if (!('effects' in node)) throw new LayerChanged()
    const effects = [...node.effects]
    const effect = effects[property.index]
    if (!effect) throw new LayerChanged()
    const bound = ('boundVariables' in effect ? effect.boundVariables : {}) as
      Record<string, VariableAlias | undefined> | undefined
    expectOld(record, bound?.[property.field]?.id)
    effects[property.index] = figma.variables.setBoundVariableForEffect(
      effect,
      property.field as VariableBindableEffectField,
      variable,
    )
    node.effects = effects
    return { ...entry, old: oldVariableLog(record), new: newLog }
  }

  throw new Error('Modes are applied after the bindings')
}

type ModeHolder = SceneNode & ExplicitVariableModesMixin

/** Sets the new mode, clears the legacy one unless it has to stay, and returns the log entry, or null when nothing changed. */
async function applyMode(
  change: PlannedChange,
  node: ModeHolder,
  targets: Targets,
  keep: boolean,
  at: string,
): Promise<LogEntry | null> {
  const { record, target, outcome } = change
  const old = record.oldMode
  if (!old || node.explicitVariableModes[old.collectionId] !== old.modeId) {
    throw new LayerChanged()
  }
  const parsed = parseModeTarget(target)
  let newLog: LogEntry['new'] = { type: 'none' }
  if (parsed) {
    const key = parsed.collection === 'density' ? NEW.density : NEW.colorScheme
    const collection = await targets.collection(key)
    const modeId = await targets.modeId(key, parsed.mode)
    const previousModeId = node.explicitVariableModes[collection.id] ?? null
    node.setExplicitVariableModeForCollection(collection, modeId)
    newLog = {
      type: 'newMode',
      collectionKey: key,
      modeName: parsed.mode,
      previousModeId,
    }
  }
  if (!keep) {
    const legacy = await targets.collection(old.collectionKey, old.collectionId)
    node.clearExplicitVariableModeForCollection(legacy)
  }
  if (!parsed && keep) return null
  return {
    property: record.property,
    old: { type: 'mode', ...old, cleared: !keep },
    new: newLog,
    outcome,
    mappingVersion: MAPPING_VERSION,
    at,
  }
}

function failure(record: BindingRecord, error: unknown): ChangeFailure {
  return {
    nodeId: record.nodeId,
    nodeName: record.nodeName,
    property: propertyLabel(record.property),
    message: error instanceof Error ? error.message : String(error),
  }
}

export async function applyChanges(
  records: BindingRecord[],
  overrides: Overrides,
  entryIds: Set<string>,
  onProgress: (done: number, total: number) => void,
  recordIds?: Set<string>,
): Promise<ApplyResult> {
  const plan = planChanges(records, overrides, entryIds, recordIds)
  const targets = new Targets()
  const fonts = new Fonts()
  const nodes = new Map<string, Promise<BaseNode | null>>()
  const node = (id: string) => {
    let found = nodes.get(id)
    if (!found) {
      found = figma.getNodeByIdAsync(id)
      nodes.set(id, found)
    }
    return found
  }
  const at = new Date().toISOString()
  const changed = new Set<string>()
  const layers = new Set<string>()
  const failed: ChangeFailure[] = []
  let modesKept = 0
  let resets = 0
  const failedFixes: string[] = []
  let values = 0
  let numbers = 0
  let modeChanges = 0
  let done = 0

  const step = async () => {
    done += 1
    if (done % 20 === 0) {
      onProgress(done, plan.length)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  const bindings = plan.filter(
    (change) => change.record.property.type !== 'mode',
  )
  const modes = plan.filter((change) => change.record.property.type === 'mode')

  // Layers reset in this run, and the ones whose reset failed: a layer is
  // reset once, for its width and height together.
  const reset = new Map<string, Error | null>()
  for (const change of bindings) {
    try {
      const found = await node(change.record.nodeId)
      if (
        !found ||
        found.removed ||
        found.type === 'PAGE' ||
        found.type === 'DOCUMENT'
      ) {
        throw new Error('The layer is no longer in the file. Scan again.')
      }
      if (isResetTarget(change.target)) {
        if (!reset.has(found.id)) {
          try {
            expectOld(change.record, fieldAlias(found, change.record))
            await resetLayer(found as SceneNode)
            reset.set(found.id, null)
            resets += 1
            // The layer has changed, whatever the check below says.
            layers.add(found.id)
          } catch (error) {
            reset.set(
              found.id,
              error instanceof Error ? error : new Error(String(error)),
            )
          }
        }
        const failedReset = reset.get(found.id)
        if (failedReset) throw failedReset
      }
      // Read before the change: the first log entry on a layer inside an
      // instance gives the instance its own plugin data there.
      const inherited = logIsInherited(found)
      const entry = await applyBinding(
        change,
        found as SceneNode,
        targets,
        fonts,
        at,
      )
      appendLog(found, entry, inherited)
      changed.add(change.record.id)
      layers.add(found.id)
      if (entry.new.type === 'value') numbers += 1
      else values += 1
    } catch (error) {
      if (error instanceof Error && error.message === LIBRARY_MISSING) {
        figma.commitUndo()
        throw error
      }
      failed.push(failure(change.record, error))
      if (isResetTarget(change.target)) failedFixes.push(change.record.id)
    }
    await step()
  }

  const keep = modesToKeep(records, changed)
  for (const change of modes) {
    const old = change.record.oldMode
    // A legacy mode stays while values below read it, unless a designer has
    // chosen to remove it anyway.
    const mustKeep =
      old !== undefined &&
      change.outcome === 'sure' &&
      keep.has(`${change.record.nodeId}|${old.collectionKey}`)
    try {
      const found = await node(change.record.nodeId)
      if (!found || found.removed || !('explicitVariableModes' in found)) {
        throw new Error('The layer is no longer in the file. Scan again.')
      }
      const entry = await applyMode(
        change,
        found as ModeHolder,
        targets,
        mustKeep,
        at,
      )
      if (entry) {
        appendLog(found, entry, logIsInherited(found))
        changed.add(change.record.id)
        layers.add(found.id)
        modeChanges += 1
      }
      if (mustKeep) modesKept += 1
    } catch (error) {
      if (error instanceof Error && error.message === LIBRARY_MISSING) {
        figma.commitUndo()
        throw error
      }
      failed.push(failure(change.record, error))
    }
    await step()
  }

  onProgress(plan.length, plan.length)
  figma.commitUndo()
  return {
    planned: plan.length,
    applied: changed.size,
    values,
    numbers,
    modes: modeChanges,
    layers: layers.size,
    modesKept,
    resets,
    failedFixes,
    failed,
  }
}

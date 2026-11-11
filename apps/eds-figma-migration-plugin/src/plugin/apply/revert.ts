/**
 * Revert frame: reads the change log on every layer in a frame and puts the
 * legacy bindings, typography and modes back, newest change first. A change
 * someone has edited since is left alone and reported.
 */
import type { TypographyField } from '../../mapping/types'
import { propertyLabel } from '../../scan/labels'
import { LOG_KEY, NAMESPACE } from '../../shared/changelog'
import type { LogEntry } from '../../shared/changelog'
import type { ChangeFailure, RevertResult } from '../../shared/messages'
import { Fonts, LayerChanged } from './apply'
import { restoreInstanceTexts } from './instance-texts'
import { readLog, writeLog } from './log'
import { Targets } from './targets'

const legacyVariables = new Map<string, Promise<Variable>>()

function legacyVariable(key: string): Promise<Variable> {
  let found = legacyVariables.get(key)
  if (!found) {
    found = figma.variables.importVariableByKeyAsync(key).catch(() => {
      throw new Error(
        'The legacy library is no longer available, so the binding cannot be put back.',
      )
    })
    legacyVariables.set(key, found)
  }
  return found
}

async function variableKey(
  id: string | undefined,
): Promise<string | undefined> {
  if (!id) return undefined
  return (await figma.variables.getVariableByIdAsync(id).catch(() => null))?.key
}

function aliasId(value: unknown): string | undefined {
  return typeof value === 'object' &&
    value !== null &&
    (value as { type?: unknown }).type === 'VARIABLE_ALIAS'
    ? (value as VariableAlias).id
    : undefined
}

async function revertEntry(
  node: SceneNode,
  entry: LogEntry,
  targets: Targets,
  fonts: Fonts,
): Promise<void> {
  const { property } = entry

  if (entry.old.type === 'component') {
    // A Typography instance replaced by a text layer: put the instance back
    // where the text is, with its properties, and remove the text.
    if (node.type !== 'TEXT') throw new LayerChanged()
    const parent = node.parent as (BaseNode & ChildrenMixin) | null
    if (!parent || !entry.old.key) throw new LayerChanged()
    const component = await figma
      .importComponentByKeyAsync(entry.old.key)
      .catch(() => {
        throw new Error(
          'The Typography component is no longer published, so it cannot be put back.',
        )
      })
    const instance = component.createInstance()
    try {
      instance.setProperties(entry.old.properties)
    } catch {
      // A property the component no longer has; the rest are set.
    }
    parent.insertChild(parent.children.indexOf(node), instance)
    instance.name = entry.old.name
    // The legacy modes on the instance give its text the size it had.
    for (const [collectionId, modeId] of Object.entries(
      entry.old.modes ?? {},
    )) {
      const collection = await figma.variables
        .getVariableCollectionByIdAsync(collectionId)
        .catch(() => null)
      if (collection) {
        instance.setExplicitVariableModeForCollection(collection, modeId)
      }
    }
    const text = instance.findOne((child) => child.type === 'TEXT')
    if (text?.type === 'TEXT' && entry.old.textFills) {
      await fonts.loadText(text)
      text.fills = entry.old.textFills as Paint[]
    }
    const inFlow =
      'layoutMode' in parent && (parent as FrameNode).layoutMode !== 'NONE'
    instance.layoutAlign = node.layoutAlign
    instance.layoutGrow = node.layoutGrow
    const sizing = entry.old.sizing
    if (sizing) {
      if (sizing.horizontal === 'FIXED' || sizing.vertical === 'FIXED') {
        instance.resize(sizing.width, sizing.height)
      }
      if (inFlow || sizing.horizontal !== 'FILL') {
        instance.layoutSizingHorizontal = sizing.horizontal
      }
      if (inFlow || sizing.vertical !== 'FILL') {
        instance.layoutSizingVertical = sizing.vertical
      }
    }
    if (!inFlow) {
      instance.x = node.x
      instance.y = node.y
    }
    if (entry.old.exposed) instance.isExposedInstance = true
    node.remove()
    // In a main component: each instance gets back the text it showed.
    if (entry.old.instances) {
      await restoreInstanceTexts(instance, entry.old.instances, fonts)
    }
    return
  }

  if (property.type === 'mode') {
    if (entry.old.type !== 'mode' || !('explicitVariableModes' in node)) {
      throw new LayerChanged()
    }
    const holder = node as SceneNode & ExplicitVariableModesMixin
    if (entry.new.type === 'newMode') {
      const collection = await targets.collection(entry.new.collectionKey)
      if (entry.new.previousModeId) {
        holder.setExplicitVariableModeForCollection(
          collection,
          entry.new.previousModeId,
        )
      } else {
        holder.clearExplicitVariableModeForCollection(collection)
      }
    }
    if (entry.old.cleared) {
      const legacy = await targets.collection(
        entry.old.collectionKey,
        entry.old.collectionId,
      )
      holder.setExplicitVariableModeForCollection(legacy, entry.old.modeId)
    }
    return
  }

  if (property.type === 'typography') {
    if (node.type !== 'TEXT' || entry.old.type !== 'typography') {
      throw new LayerChanged()
    }
    if (entry.new.type !== 'textStyle') throw new LayerChanged()
    const [start, end] = property.range ?? [0, node.characters.length]
    if (end > node.characters.length) throw new LayerChanged()
    const styleId = property.range
      ? node.getRangeTextStyleId(start, end)
      : node.textStyleId
    if (typeof styleId !== 'string') throw new LayerChanged()
    const style = await figma.getStyleByIdAsync(styleId)
    if (style?.key !== entry.new.key) throw new LayerChanged()
    await fonts.loadText(node, property.range)
    if (entry.old.font) await fonts.load(entry.old.font)
    if (property.range) await node.setRangeTextStyleIdAsync(start, end, '')
    else await node.setTextStyleIdAsync('')
    for (const [field, old] of Object.entries(entry.old.fields)) {
      if (!old) continue
      const variable = await legacyVariable(old.key)
      node.setRangeBoundVariable(start, end, field as TypographyField, variable)
    }
    return
  }

  if (entry.old.type === 'variable' && entry.new.type === 'value') {
    // A number set without a variable: bind the legacy variable again, as
    // long as nobody has bound another variable since.
    if (property.type !== 'field') throw new LayerChanged()
    const bindable = node as SceneNode & {
      boundVariables?: Record<string, unknown>
      setBoundVariable: (
        field: VariableBindableNodeField,
        v: Variable | null,
      ) => void
    }
    if (aliasId((bindable.boundVariables ?? {})[property.field])) {
      throw new LayerChanged()
    }
    bindable.setBoundVariable(
      property.field as VariableBindableNodeField,
      await legacyVariable(entry.old.key),
    )
    return
  }
  if (entry.old.type !== 'variable' || entry.new.type !== 'variable') {
    throw new LayerChanged()
  }
  const expected = entry.new.key
  const old = await legacyVariable(entry.old.key)

  if (property.type === 'field') {
    const bindable = node as SceneNode & {
      boundVariables?: Record<string, unknown>
      setBoundVariable: (
        field: VariableBindableNodeField,
        v: Variable | null,
      ) => void
    }
    const current = aliasId((bindable.boundVariables ?? {})[property.field])
    if ((await variableKey(current)) !== expected) throw new LayerChanged()
    bindable.setBoundVariable(property.field as VariableBindableNodeField, old)
    return
  }

  if (property.type === 'paint') {
    if (node.type === 'TEXT') await fonts.loadText(node, property.range)
    const rebind = async (paints: readonly Paint[]): Promise<Paint[]> => {
      const paint = paints[property.index]
      if (paint?.type !== 'SOLID') throw new LayerChanged()
      if ((await variableKey(paint.boundVariables?.color?.id)) !== expected) {
        throw new LayerChanged()
      }
      const copy = [...paints]
      copy[property.index] = figma.variables.setBoundVariableForPaint(
        paint,
        'color',
        old,
      )
      return copy
    }
    if (property.range) {
      if (node.type !== 'TEXT') throw new LayerChanged()
      const [start, end] = property.range
      const paints = node.getRangeFills(start, end)
      if (paints === figma.mixed) throw new LayerChanged()
      node.setRangeFills(start, end, await rebind(paints))
    } else {
      const holder = node as SceneNode & Record<'fills' | 'strokes', unknown>
      const paints = holder[property.field]
      if (!Array.isArray(paints)) throw new LayerChanged()
      holder[property.field] = await rebind(paints as Paint[])
    }
    return
  }

  if (property.type === 'effect') {
    if (!('effects' in node)) throw new LayerChanged()
    const effects = [...node.effects]
    const effect = effects[property.index]
    const bound = (
      effect && 'boundVariables' in effect ? effect.boundVariables : {}
    ) as Record<string, VariableAlias | undefined> | undefined
    if (
      !effect ||
      (await variableKey(bound?.[property.field]?.id)) !== expected
    ) {
      throw new LayerChanged()
    }
    effects[property.index] = figma.variables.setBoundVariableForEffect(
      effect,
      property.field as VariableBindableEffectField,
      old,
    )
    node.effects = effects
  }
}

/** Layers in the roots that have a change log, the roots included. */
function loggedLayers(roots: SceneNode[]): SceneNode[] {
  const found: SceneNode[] = []
  for (const root of roots) {
    if (root.getSharedPluginData(NAMESPACE, LOG_KEY)) found.push(root)
    if ('findAllWithCriteria' in root) {
      found.push(
        ...root.findAllWithCriteria({
          sharedPluginData: { namespace: NAMESPACE, keys: [LOG_KEY] },
        }),
      )
    }
  }
  return found
}

export async function revertRoots(roots: SceneNode[]): Promise<RevertResult> {
  const targets = new Targets()
  const fonts = new Fonts()
  const failed: ChangeFailure[] = []
  let reverted = 0
  const layers = loggedLayers(roots)
  for (const node of layers) {
    const entries = readLog(node)
    const remaining: LogEntry[] = []
    for (const entry of [...entries].reverse()) {
      try {
        await revertEntry(node, entry, targets, fonts)
        reverted += 1
        if (node.removed) break
      } catch (error) {
        remaining.unshift(entry)
        failed.push({
          nodeId: node.id,
          nodeName: node.name,
          property: propertyLabel(entry.property),
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }
    if (!node.removed) writeLog(node, remaining)
  }
  figma.commitUndo()
  return { reverted, layers: layers.length, failed }
}

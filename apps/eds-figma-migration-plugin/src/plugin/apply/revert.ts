/**
 * Revert frame: reads the change log on every layer in a frame and puts the
 * legacy bindings, typography and modes back, newest change first. A change
 * someone has edited since is left alone and reported.
 */
import type { TypographyField } from '../../mapping/types'
import { propertyLabel } from '../../scan/labels'
import { indexAmongChildren, outermostInstance } from '../../scan/slots'
import { LOG_KEY, NAMESPACE } from '../../shared/changelog'
import type {
  LogEntry,
  LoggedComponent,
  LoggedTypography,
} from '../../shared/changelog'
import type { ChangeFailure, RevertResult } from '../../shared/messages'
import { expectBound, Fonts, LayerChanged, NotBound } from './apply'
import { restoreInstanceTexts } from './instance-texts'
import { logIsInherited, readLog, writeLog } from './log'
import { Targets } from './targets'

const legacyVariables = new Map<string, Promise<Variable>>()

function legacyVariable(key: string): Promise<Variable> {
  let found = legacyVariables.get(key)
  if (!found) {
    found = figma.variables.importVariableByKeyAsync(key).catch(() => {
      // Not kept, so a later Revert tries again, for example once the
      // legacy library is enabled in the file.
      legacyVariables.delete(key)
      throw new Error(
        'The legacy library is no longer available, so the binding cannot be put back.',
      )
    })
    legacyVariables.set(key, found)
  }
  return found
}

/** The rule of a Manual fix the plugin made by resetting a layer inside an instance (scan/classify.ts). */
const SIZE_OVERRIDE_RULE = 'instance/size-override'

/**
 * A Manual fix cannot be reverted: the plugin reset the layer inside the
 * instance, and Figma ignores a plugin that binds a variable to the width or
 * height of a layer there, so the legacy size does not come back (NotBound).
 */
export const MANUAL_FIX_NOT_REVERTED =
  'Revert frame cannot put back the legacy size of a Manual fix: the plugin made the fix by resetting the layer inside the instance, and Figma does not let a plugin bind a variable to the size of a layer there. Undo it with Ctrl or Cmd+Z in the session it was made in, or keep it: the layer has the size of its main component.'

/**
 * Whether a change logged before the rule was (2026-11-16) failed the way a
 * Manual fix does: a size inside an instance that Figma would not bind.
 */
function unloggedManualFix(entry: LogEntry, error: unknown): boolean {
  return (
    entry.rule === undefined &&
    error instanceof NotBound &&
    entry.property.type === 'field' &&
    (entry.property.field === 'width' || entry.property.field === 'height')
  )
}

/**
 * Sets the font and the values a text had before the text style, then binds
 * its legacy variables, which win over the values on their fields. A log
 * entry from before 2026-11-25 has no values, so the style's stay where no
 * legacy variable was bound.
 */
function restoreTypography(
  node: TextNode,
  [start, end]: [number, number],
  old: LoggedTypography,
  variables: [TypographyField, Variable][],
): void {
  // A range needs one character at least; an empty text takes the values
  // on the layer.
  const whole = end <= start
  if (old.font) {
    if (whole) node.fontName = old.font
    else node.setRangeFontName(start, end, old.font)
  }
  const values = old.values ?? {}
  if (values.fontSize !== undefined) {
    if (whole) node.fontSize = values.fontSize
    else node.setRangeFontSize(start, end, values.fontSize)
  }
  if (values.lineHeight) {
    if (whole) node.lineHeight = values.lineHeight
    else node.setRangeLineHeight(start, end, values.lineHeight)
  }
  if (values.letterSpacing) {
    if (whole) node.letterSpacing = values.letterSpacing
    else node.setRangeLetterSpacing(start, end, values.letterSpacing)
  }
  if (values.paragraphSpacing !== undefined) {
    if (whole) node.paragraphSpacing = values.paragraphSpacing
    else node.setRangeParagraphSpacing(start, end, values.paragraphSpacing)
  }
  if (values.paragraphIndent !== undefined) {
    if (whole) node.paragraphIndent = values.paragraphIndent
    else node.setRangeParagraphIndent(start, end, values.paragraphIndent)
  }
  if (values.textCase) {
    if (whole) node.textCase = values.textCase
    else node.setRangeTextCase(start, end, values.textCase)
  }
  if (values.textDecoration) {
    if (whole) node.textDecoration = values.textDecoration
    else node.setRangeTextDecoration(start, end, values.textDecoration)
  }
  for (const [field, variable] of variables) {
    if (whole) node.setBoundVariable(field, variable)
    else node.setRangeBoundVariable(start, end, field, variable)
  }
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

/**
 * Puts a Typography instance, made from the logged component, back where
 * the text layer is, with its name, modes, text colour and sizing, and
 * removes the text layer.
 */
async function putBackTypography(
  node: TextNode,
  parent: BaseNode & ChildrenMixin,
  index: number,
  instance: InstanceNode,
  old: LoggedComponent,
  fonts: Fonts,
): Promise<void> {
  try {
    instance.setProperties(old.properties)
  } catch {
    // A property the component no longer has; the rest are set.
  }
  parent.insertChild(index, instance)
  instance.name = old.name
  // Convert copied these from the instance to the text layer (convert.ts,
  // place); a hidden Typography instance came back visible without them
  // (test page in Figma, 2026-11-19).
  instance.visible = node.visible
  instance.locked = node.locked
  instance.opacity = node.opacity
  // The legacy modes on the instance give its text the size it had.
  for (const [collectionId, modeId] of Object.entries(old.modes ?? {})) {
    const collection = await figma.variables
      .getVariableCollectionByIdAsync(collectionId)
      .catch(() => null)
    if (collection) {
      instance.setExplicitVariableModeForCollection(collection, modeId)
    }
  }
  const text = instance.findOne((child) => child.type === 'TEXT')
  if (text?.type === 'TEXT' && old.textFills) {
    await fonts.loadText(text)
    text.fills = old.textFills as Paint[]
  }
  const inFlow =
    'layoutMode' in parent && (parent as FrameNode).layoutMode !== 'NONE'
  instance.layoutAlign = node.layoutAlign
  instance.layoutGrow = node.layoutGrow
  const sizing = old.sizing
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
  if (old.exposed) instance.isExposedInstance = true
  node.remove()
  // In a main component: each instance gets back the text it showed.
  if (old.instances) {
    await restoreInstanceTexts(instance, old.instances, fonts)
  }
}

async function revertEntry(
  node: SceneNode,
  entry: LogEntry,
  targets: Targets,
  fonts: Fonts,
): Promise<void> {
  const { property } = entry

  // Trying would change nothing, since Figma ignores the binding, so the
  // legacy variable is not even imported.
  if (entry.rule === SIZE_OVERRIDE_RULE && outermostInstance(node, false)) {
    throw new Error(MANUAL_FIX_NOT_REVERTED)
  }

  if (entry.old.type === 'component') {
    // A Typography instance replaced by a text layer: put the instance back
    // where the text is, with its properties, and remove the text.
    if (node.type !== 'TEXT') throw new LayerChanged()
    const parent = node.parent as (BaseNode & ChildrenMixin) | null
    if (!parent || !entry.old.key) throw new LayerChanged()
    const index = indexAmongChildren(parent.children, node)
    if (index === -1) throw new LayerChanged()
    const component = await figma
      .importComponentByKeyAsync(entry.old.key)
      .catch(() => {
        throw new Error(
          'The Typography component is no longer published, so it cannot be put back.',
        )
      })
    const instance = component.createInstance()
    try {
      await putBackTypography(node, parent, index, instance, entry.old, fonts)
    } catch (error) {
      // Leave nothing behind: while the text layer is still there, the new
      // instance is a leftover of the failed step. Once the text layer is
      // removed, the instance is what was put back, so it stays.
      if (!instance.removed && !node.removed) instance.remove()
      throw error
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
    // Everything that can fail on its own comes before the style is
    // cleared: the fonts and the legacy variables. A failure then leaves the
    // text in its EDS Beta style, so the check above passes when Revert is
    // tried again. Cleared first, a failure left the text without a style,
    // and every later Revert stopped at that check.
    await fonts.loadText(node, property.range)
    if (entry.old.font) await fonts.load(entry.old.font)
    const variables: [TypographyField, Variable][] = []
    for (const [field, old] of Object.entries(entry.old.fields)) {
      if (old) {
        variables.push([
          field as TypographyField,
          await legacyVariable(old.key),
        ])
      }
    }
    const setStyle = (id: string) =>
      property.range
        ? node.setRangeTextStyleIdAsync(start, end, id)
        : node.setTextStyleIdAsync(id)
    await setStyle('')
    try {
      restoreTypography(node, [start, end], entry.old, variables)
    } catch (error) {
      // Back to the EDS Beta style, so the text is as it was and Revert can
      // be tried again.
      await setStyle(styleId).catch(() => undefined)
      throw error
    }
    return
  }

  if (
    entry.old.type === 'variable' &&
    entry.new.type === 'value' &&
    property.type === 'effect'
  ) {
    // A number set without a variable on an effect, such as the blur of a
    // shadow: bind the legacy variable to the effect's field again, as long
    // as nobody has bound another variable there since.
    if (!('effects' in node)) throw new LayerChanged()
    const effects = [...node.effects]
    const effect = effects[property.index]
    const bound = (
      effect && 'boundVariables' in effect ? effect.boundVariables : {}
    ) as Record<string, VariableAlias | undefined> | undefined
    if (!effect || bound?.[property.field]) throw new LayerChanged()
    const legacy = await legacyVariable(entry.old.key)
    effects[property.index] = figma.variables.setBoundVariableForEffect(
      effect,
      property.field as VariableBindableEffectField,
      legacy,
    )
    node.effects = effects
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
    const legacy = await legacyVariable(entry.old.key)
    bindable.setBoundVariable(
      property.field as VariableBindableNodeField,
      legacy,
    )
    expectBound(bindable, property.field, legacy)
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
    expectBound(bindable, property.field, old)
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

/**
 * Layers in the roots that have a change log of their own, the roots
 * included. A layer inside an instance also shows the log of the main
 * component's layer, and reverting that would put an override on the
 * instance, so it is left to the main component.
 *
 * The layers are found by walking `children`, not with
 * `findAllWithCriteria`: for a layer a session has added to the slot of an
 * instance, the search returns another layer (`I<instance>;<slot>;2134:519`
 * for the `2134:518` in the slot's list) that is not among its parent's
 * children, so a Typography instance could not be put back in its place
 * (test page in Figma, 2026-11-19, Convert and Revert in one session).
 */
function loggedLayers(roots: SceneNode[]): SceneNode[] {
  figma.skipInvisibleInstanceChildren = false
  const found: SceneNode[] = []
  const visit = (node: SceneNode) => {
    if (node.getSharedPluginData(NAMESPACE, LOG_KEY)) found.push(node)
    if ('children' in node) for (const child of node.children) visit(child)
  }
  for (const root of roots) visit(root)
  return found.filter((node) => !logIsInherited(node))
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
        // Kept in the log and reported, as every change that cannot be put
        // back is, such as one whose legacy library is gone.
        remaining.unshift(entry)
        failed.push({
          nodeId: node.id,
          nodeName: node.name,
          property: propertyLabel(entry.property),
          message: unloggedManualFix(entry, error)
            ? MANUAL_FIX_NOT_REVERTED
            : error instanceof Error
              ? error.message
              : String(error),
        })
      }
    }
    if (!node.removed) writeLog(node, remaining)
  }
  figma.commitUndo()
  return { reverted, layers: layers.length, failed }
}

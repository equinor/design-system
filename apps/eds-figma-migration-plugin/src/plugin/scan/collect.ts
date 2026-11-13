/**
 * Reads the document into raw units: every bound variable, the typography of
 * every text or text range, and every explicit mode, with the context the
 * rules need. Nothing here classifies or changes anything.
 *
 * This module imports no inventory, so it can also be bundled on its own to
 * export the scan of a frame as a test fixture.
 */
import { collectionKeyFromId } from '../../mapping/ids'
import type {
  BindingKind,
  ChainStep,
  RoleContext,
  TypographyField,
  VariableType,
} from '../../mapping/types'
import { INSTANCE_LOCKED_FIELDS } from '../../scan/classify'
import { LOG_KEY, NAMESPACE } from '../../shared/changelog'
import { readLog } from '../apply/log'
import {
  effectVariableId,
  fieldVariableId,
  InstanceOverrides,
  paintVariableId,
  textFillHas,
  textTypographyHas,
} from './overrides'
import type { SameBinding } from './overrides'
import type {
  PropertyRef,
  RawFillUnder,
  RawTextStyle,
  RawUnit,
  RawVariable,
} from '../../scan/types'

export class ScanCancelled extends Error {
  constructor() {
    super('The scan was cancelled')
  }
}

export type CollectOptions = {
  /** Key of `💎 Density`, where alias chains stop */
  densityKey: string
  /** Collection keys of the deprecated libraries; only their variables get an alias chain */
  oldKeys: Set<string>
  /** Called every few hundred nodes with the count so far; return true to stop */
  onProgress?: (nodes: number) => boolean | Promise<boolean>
  /** Called for every unit as it is collected, with its layer; for the scan map in the window */
  onUnit?: (node: SceneNode, unit: RawUnit) => void
}

export type Modes = Record<string, string>

type WalkState = {
  entryId: string
  /** Ancestor names, nearest first */
  names: string[]
  /** Names from the entry root down to the parent */
  path: string[]
  modes: Modes
  reactions: boolean
  fillUnder?: RawFillUnder
  instanceId?: string
  /** The outermost instance the node is in */
  instanceRoot?: InstanceNode
  /** Child positions from the outermost instance down to the node */
  instancePath: number[]
  /** True inside a local component, whose nested components are not split off */
  inComponent: boolean
  isRoot: boolean
  /** Ids of ancestors in the entry that set explicit modes */
  modeHolders: string[]
}

/** The fields every unit of a node shares. */
type UnitBase = Pick<
  RawUnit,
  | 'nodeId'
  | 'nodeName'
  | 'nodeType'
  | 'entryId'
  | 'path'
  | 'instanceId'
  | 'modeHolders'
  | 'context'
>

/** Whether a binding on the layer is an override of the instance it is in; false outside instances. */
type Ownership = (property: PropertyRef, same: SameBinding) => Promise<boolean>

export type FoundInstance = {
  id: string
  name: string
  entryId: string
  /** Layer names from the entry down to the instance's parent */
  path: string[]
}

/** A component's name as the window shows it: its component set's, for a variant. */
function componentName(component: ComponentNode): string {
  return component.parent?.type === 'COMPONENT_SET'
    ? component.parent.name
    : component.name
}

const FIELD_KINDS: Record<string, BindingKind> = {
  paddingLeft: 'spacing',
  paddingRight: 'spacing',
  paddingTop: 'spacing',
  paddingBottom: 'spacing',
  itemSpacing: 'spacing',
  counterAxisSpacing: 'spacing',
  gridRowGap: 'spacing',
  gridColumnGap: 'spacing',
  width: 'size',
  height: 'size',
  minWidth: 'size',
  maxWidth: 'size',
  minHeight: 'size',
  maxHeight: 'size',
  cornerRadius: 'radius',
  topLeftRadius: 'radius',
  topRightRadius: 'radius',
  bottomLeftRadius: 'radius',
  bottomRightRadius: 'radius',
  strokeWeight: 'strokeWeight',
  strokeTopWeight: 'strokeWeight',
  strokeRightWeight: 'strokeWeight',
  strokeBottomWeight: 'strokeWeight',
  strokeLeftWeight: 'strokeWeight',
  opacity: 'opacity',
}

/** Fields that are read elsewhere: paints, effects, and the per-range text fields. */
const SKIPPED_FIELDS = new Set([
  'fills',
  'strokes',
  'effects',
  'layoutGrids',
  'componentProperties',
  'textRangeFills',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paragraphSpacing',
  'paragraphIndent',
])

const SHAPE_TYPES = new Set([
  'RECTANGLE',
  'ELLIPSE',
  'POLYGON',
  'STAR',
  'VECTOR',
  'LINE',
  'BOOLEAN_OPERATION',
])

function isAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { type?: unknown }).type === 'VARIABLE_ALIAS'
  )
}

function modesSignature(modes: Modes): string {
  return Object.keys(modes)
    .sort()
    .map((id) => `${id}=${modes[id]}`)
    .join(';')
}

export function explicitModes(node: BaseNode): Modes {
  return 'explicitVariableModes' in node
    ? { ...(node.explicitVariableModes as Modes) }
    : {}
}

export class Collector {
  readonly units: RawUnit[] = []
  readonly instances = new Map<string, FoundInstance>()
  /** Layers with a change log, by entry */
  readonly changed = new Map<string, number>()
  /** Local components found inside frames, to be listed as their own entries */
  readonly nestedComponents: {
    node: ComponentNode | ComponentSetNode
    entryId: string
    modes: Modes
  }[] = []
  nodes = 0

  private readonly variables = new Map<string, Promise<Variable | null>>()
  private readonly collections = new Map<
    string,
    Promise<VariableCollection | null>
  >()
  private readonly styles = new Map<string, Promise<RawTextStyle | null>>()
  private readonly chains = new Map<string, Promise<ChainStep[]>>()
  private readonly modeNames = new Map<
    string,
    Promise<Record<string, string>>
  >()
  private readonly overrides = new InstanceOverrides()

  constructor(private readonly options: CollectOptions) {}

  /** Collects an entry: a frame or component, or a list of loose layers. */
  async collectEntry(
    roots: SceneNode[],
    entryId: string,
    inheritedModes: Modes,
    inComponent = false,
  ): Promise<void> {
    for (const root of roots) {
      await this.walk(root, {
        entryId,
        names: [],
        path: [],
        modes: inheritedModes,
        reactions: false,
        instancePath: [],
        inComponent,
        isRoot: true,
        modeHolders: [],
      })
    }
  }

  // --- Lookups, cached for the whole scan

  private variable(id: string): Promise<Variable | null> {
    let found = this.variables.get(id)
    if (!found) {
      found = figma.variables.getVariableByIdAsync(id).catch(() => null)
      this.variables.set(id, found)
    }
    return found
  }

  private collection(id: string): Promise<VariableCollection | null> {
    let found = this.collections.get(id)
    if (!found) {
      found = figma.variables
        .getVariableCollectionByIdAsync(id)
        .catch(() => null)
      this.collections.set(id, found)
    }
    return found
  }

  private async collectionKey(collectionId: string): Promise<string> {
    return (
      collectionKeyFromId(collectionId) ??
      (await this.collection(collectionId))?.key ??
      ''
    )
  }

  private textStyle(id: string): Promise<RawTextStyle | null> {
    let found = this.styles.get(id)
    if (!found) {
      found = figma
        .getStyleByIdAsync(id)
        .then((style) =>
          style ? { id, key: style.key, name: style.name } : null,
        )
        .catch(() => null)
      this.styles.set(id, found)
    }
    return found
  }

  /** Collection key → mode name for every collection with a mode set on the layer or an ancestor. */
  private modeNamesByKey(modes: Modes): Promise<Record<string, string>> {
    const signature = modesSignature(modes)
    let found = this.modeNames.get(signature)
    if (!found) {
      found = (async () => {
        const names: Record<string, string> = {}
        for (const [collectionId, modeId] of Object.entries(modes)) {
          const collection = await this.collection(collectionId)
          const key = await this.collectionKey(collectionId)
          const mode = collection?.modes.find((m) => m.modeId === modeId)
          if (key && mode) names[key] = mode.name
        }
        return names
      })()
      this.modeNames.set(signature, found)
    }
    return found
  }

  /**
   * Follows the aliases of a variable under the modes in force, down to the
   * first `💎 Density` variable or the first value that is not an alias.
   */
  private chain(variable: Variable, modes: Modes): Promise<ChainStep[]> {
    const signature = `${variable.id}|${modesSignature(modes)}`
    let found = this.chains.get(signature)
    if (!found) {
      found = (async () => {
        const steps: ChainStep[] = []
        let current = variable
        for (let depth = 0; depth < 8; depth++) {
          const collection = await this.collection(current.variableCollectionId)
          const modeId =
            modes[current.variableCollectionId] ?? collection?.defaultModeId
          const values = current.valuesByMode
          const value =
            (modeId !== undefined ? values[modeId] : undefined) ??
            Object.values(values)[0]
          if (!isAlias(value)) break
          const next = await this.variable(value.id)
          if (!next) break
          const key = await this.collectionKey(next.variableCollectionId)
          steps.push({ collectionKey: key, name: next.name })
          if (key === this.options.densityKey) break
          current = next
        }
        return steps
      })()
      this.chains.set(signature, found)
    }
    return found
  }

  /**
   * The layer at the same place in the main component: the variable on a
   * field of it, and, when the layer is an instance of another component,
   * the swap a reset would undo.
   */
  private async mainSide(
    node: SceneNode,
    instance: InstanceNode,
    path: number[],
    field: string,
    modes: Modes,
  ): Promise<{
    mainVariable?: RawVariable
    swap?: {
      from: string
      to: string
      property?: { name: string; on: string }
    }
  }> {
    const counterpart = await this.overrides.counterpart(instance, path)
    if (!counterpart) return {}
    const id = fieldVariableId(counterpart, field)
    const mainVariable = id
      ? await this.rawVariable(id, counterpart, modes)
      : undefined
    let swap:
      | { from: string; to: string; property?: { name: string; on: string } }
      | undefined
    if (node.type === 'INSTANCE' && counterpart.type === 'INSTANCE') {
      const [now, before] = await Promise.all([
        node.getMainComponentAsync().catch(() => null),
        counterpart.getMainComponentAsync().catch(() => null),
      ])
      if (now && before && now.id !== before.id) {
        // A swap made through an instance-swap property of the instance
        // above, such as Icon on .Icon Wrapper, is undone through it.
        const key = node.componentPropertyReferences?.mainComponent
        const holder = node.parent
        swap = {
          from: componentName(before),
          to: componentName(now),
          ...(key && holder?.type === 'INSTANCE'
            ? { property: { name: key.split('#')[0], on: holder.name } }
            : {}),
        }
      }
    }
    return {
      ...(mainVariable ? { mainVariable } : {}),
      ...(swap ? { swap } : {}),
    }
  }

  private async rawVariable(
    id: string,
    node: SceneNode,
    modes: Modes,
  ): Promise<RawVariable | undefined> {
    const variable = await this.variable(id)
    if (!variable) return undefined
    const collection = await this.collection(variable.variableCollectionId)
    const collectionKey = await this.collectionKey(
      variable.variableCollectionId,
    )
    const raw: RawVariable = {
      id: variable.id,
      key: variable.key,
      name: variable.name,
      type: variable.resolvedType as VariableType,
      collectionKey,
      collectionName: collection?.name ?? '',
    }
    const isLegacy = this.options.oldKeys.has(collectionKey)
    if (isLegacy && variable.resolvedType === 'COLOR') {
      try {
        const resolved = variable.resolveForConsumer(node).value
        if (isRgba(resolved)) raw.colour = toHex(resolved)
      } catch {
        // The colour could not be resolved for this layer; it is left out.
      }
    }
    let value: number | undefined
    if (isLegacy && variable.resolvedType === 'FLOAT') {
      try {
        const resolved = variable.resolveForConsumer(node).value
        if (typeof resolved === 'number') value = resolved
      } catch {
        // The value could not be resolved for this layer; it is left out.
      }
      if (value !== undefined) raw.value = value
    }
    if (
      isLegacy &&
      collectionKey !== this.options.densityKey &&
      variable.resolvedType !== 'COLOR'
    ) {
      raw.chain = await this.chain(variable, modes)
      const reachesDensity = raw.chain.some(
        (step) => step.collectionKey === this.options.densityKey,
      )
      if (!reachesDensity && value !== undefined) raw.resolvedValue = value
    }
    return raw
  }

  // --- Context

  private async context(
    node: SceneNode,
    names: string[],
    modes: Modes,
    reactions: boolean,
  ): Promise<Omit<RoleContext, 'fillUnder'>> {
    const context: Omit<RoleContext, 'fillUnder'> = {
      nodeType: node.type,
      names,
      modes: await this.modeNamesByKey(modes),
    }
    if (reactions) context.hasReactions = true
    if ('strokes' in node && node.strokes.length > 0) {
      if ('strokeTopWeight' in node) {
        context.strokeSides = [
          node.strokeTopWeight,
          node.strokeRightWeight,
          node.strokeBottomWeight,
          node.strokeLeftWeight,
        ]
      } else if (typeof node.strokeWeight === 'number') {
        const weight = node.strokeWeight
        context.strokeSides = [weight, weight, weight, weight]
      }
    }
    if (node.type === 'TEXT') context.singleLine = isSingleLine(node)
    // A thin shape or an empty frame can be a line drawn with a fill.
    if (
      SHAPE_TYPES.has(node.type) ||
      (node.type === 'FRAME' && node.children.length === 0)
    ) {
      context.size = [
        Math.round(node.width * 100) / 100,
        Math.round(node.height * 100) / 100,
      ]
    }
    return context
  }

  // --- The walk

  private async walk(node: SceneNode, state: WalkState): Promise<void> {
    if (
      !state.isRoot &&
      !state.inComponent &&
      !state.instanceId &&
      (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')
    ) {
      this.nestedComponents.push({
        node,
        entryId: state.entryId,
        modes: state.modes,
      })
      return
    }

    this.nodes += 1
    if (this.nodes % 250 === 0 && this.options.onProgress) {
      if (await this.options.onProgress(this.nodes)) throw new ScanCancelled()
    }

    const explicit = explicitModes(node)
    const modes = { ...state.modes, ...explicit }
    const modeHolders =
      Object.keys(explicit).length > 0
        ? [...state.modeHolders, node.id]
        : state.modeHolders
    const instanceId =
      state.instanceId ?? (node.type === 'INSTANCE' ? node.id : undefined)
    const instanceRoot =
      state.instanceRoot ?? (node.type === 'INSTANCE' ? node : undefined)
    const instancePath = state.instanceRoot ? state.instancePath : []
    if (node.type === 'INSTANCE' && !state.instanceId) {
      this.instances.set(node.id, {
        id: node.id,
        name: node.name,
        entryId: state.entryId,
        path: state.path,
      })
    }
    const owns: Ownership = (property, same) =>
      instanceRoot
        ? this.overrides.isOverride(
            instanceRoot,
            node.id,
            instancePath,
            property,
            same,
          )
        : Promise.resolve(false)
    // A layer in an instance reads the main component's change log until
    // the instance has its own.
    const hasLog =
      node.getSharedPluginData(NAMESPACE, LOG_KEY) !== '' &&
      (!instanceRoot || this.overrides.ownsPluginData(instanceRoot, node.id))
    if (hasLog) {
      this.changed.set(
        state.entryId,
        (this.changed.get(state.entryId) ?? 0) + 1,
      )
    }
    const names = [node.name, ...state.names]
    const reactions =
      state.reactions || ('reactions' in node && node.reactions.length > 0)
    const own = await this.context(node, names, modes, reactions)
    const context =
      node.type === 'TEXT' || SHAPE_TYPES.has(node.type)
        ? { ...own, fillUnder: state.fillUnder }
        : own
    const base: UnitBase = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      entryId: state.entryId,
      path: state.path,
      instanceId,
      context,
      ...(modeHolders.length > 0 ? { modeHolders } : {}),
    }
    const push = (unit: RawUnit) => {
      this.units.push(unit)
      this.options.onUnit?.(node, unit)
    }

    // Explicit modes
    for (const [collectionId, modeId] of Object.entries(explicit)) {
      const collection = await this.collection(collectionId)
      push({
        ...base,
        unit: 'mode',
        property: { type: 'mode', collectionId },
        collectionId,
        collectionKey: await this.collectionKey(collectionId),
        collectionName: collection?.name ?? collectionId,
        modeId,
        modeName:
          collection?.modes.find((mode) => mode.modeId === modeId)?.name ??
          modeId,
      })
    }

    // Bound fields
    const bound = (node.boundVariables ?? {}) as Record<string, unknown>
    for (const [field, alias] of Object.entries(bound)) {
      if (SKIPPED_FIELDS.has(field) || !isAlias(alias)) continue
      const variable = await this.rawVariable(alias.id, node, modes)
      if (!variable) continue
      const property: PropertyRef = { type: 'field', field }
      const override = await owns(
        property,
        (counterpart) => fieldVariableId(counterpart, field) === alias.id,
      )
      // A size the instance overrides on a layer inside it is a manual
      // fix in Figma: a reset of the layer, so the main component's layer
      // there decides the target and whether the layer was swapped.
      const mainSide =
        override && instanceRoot && INSTANCE_LOCKED_FIELDS.has(field)
          ? await this.mainSide(node, instanceRoot, instancePath, field, modes)
          : undefined
      push({
        ...base,
        ...(override ? { override: true } : {}),
        unit: 'variable',
        kind: FIELD_KINDS[field] ?? 'other',
        property,
        variable,
        ...mainSide,
      })
    }

    // Paints
    const isText = node.type === 'TEXT'
    if ('fills' in node && node.fills !== figma.mixed) {
      await this.paints(
        node,
        node.fills,
        'fills',
        isText ? 'textFill' : 'fill',
        modes,
        base,
        push,
        owns,
      )
    } else if (isText) {
      for (const segment of node.getStyledTextSegments(['fills'])) {
        await this.paints(
          node,
          segment.fills,
          'fills',
          'textFill',
          modes,
          base,
          push,
          owns,
          [segment.start, segment.end],
        )
      }
    }
    if ('strokes' in node) {
      await this.paints(
        node,
        node.strokes,
        'strokes',
        'stroke',
        modes,
        base,
        push,
        owns,
      )
    }
    if ('effects' in node) {
      for (const [index, effect] of node.effects.entries()) {
        const effectBound = (
          'boundVariables' in effect ? effect.boundVariables : undefined
        ) as Record<string, VariableAlias | undefined> | undefined
        for (const [field, alias] of Object.entries(effectBound ?? {})) {
          if (!alias) continue
          const variable = await this.rawVariable(alias.id, node, modes)
          if (!variable) continue
          const property: PropertyRef = { type: 'effect', index, field }
          const override = await owns(
            property,
            (counterpart) =>
              effectVariableId(counterpart, index, field) === alias.id,
          )
          push({
            ...base,
            ...(override ? { override: true } : {}),
            unit: 'variable',
            kind: field === 'color' ? 'effect' : 'other',
            property,
            variable,
          })
        }
      }
    }

    // Numbers the plugin set in place of a legacy variable, such as border
    // widths, count as migrated while the layer keeps them.
    if (hasLog) {
      const counted = new Set<string>()
      for (const entry of readLog(node)) {
        if (entry.new.type !== 'value' || entry.property.type !== 'field') {
          continue
        }
        const { field } = entry.property
        if (counted.has(field) || field in bound) continue
        const current = (node as unknown as Record<string, unknown>)[field]
        if (current !== entry.new.value) continue
        counted.add(field)
        push({
          ...base,
          // Only a change log of the instance's own is read inside one.
          ...(instanceRoot ? { override: true } : {}),
          unit: 'value',
          property: entry.property,
          value: entry.new.value,
        })
      }
    }

    // Typography
    if (node.type === 'TEXT') {
      await this.typography(node, modes, base, push, owns)
    }

    // Children
    if ('children' in node) {
      const fill = await this.visibleFill(node, modes, own)
      const childState: WalkState = {
        entryId: state.entryId,
        names,
        path: [...state.path, node.name],
        modes,
        reactions,
        fillUnder: fill ?? state.fillUnder,
        instanceId,
        instanceRoot,
        instancePath,
        inComponent:
          state.inComponent ||
          node.type === 'COMPONENT' ||
          node.type === 'COMPONENT_SET',
        isRoot: false,
        modeHolders,
      }
      for (const [index, child] of node.children.entries()) {
        await this.walk(child, {
          ...childState,
          instancePath: instanceRoot ? [...instancePath, index] : [],
        })
      }
    }
  }

  private async paints(
    node: SceneNode,
    paints: ReadonlyArray<Paint>,
    field: 'fills' | 'strokes',
    kind: BindingKind,
    modes: Modes,
    base: UnitBase,
    push: (unit: RawUnit) => void,
    owns: Ownership,
    range?: [number, number],
  ): Promise<void> {
    for (const [index, paint] of paints.entries()) {
      const alias =
        paint.type === 'SOLID' ? paint.boundVariables?.color : undefined
      if (!alias) continue
      const variable = await this.rawVariable(alias.id, node, modes)
      if (!variable) continue
      const property: PropertyRef = range
        ? { type: 'paint', field, index, range }
        : { type: 'paint', field, index }
      const override = await owns(property, (counterpart) =>
        range
          ? textFillHas(counterpart, index, alias.id)
          : paintVariableId(counterpart, field, index) === alias.id,
      )
      push({
        ...base,
        ...(override ? { override: true } : {}),
        unit: 'variable',
        kind,
        property,
        variable,
      })
    }
  }

  private async typography(
    node: TextNode,
    modes: Modes,
    base: UnitBase,
    push: (unit: RawUnit) => void,
    owns: Ownership,
  ): Promise<void> {
    const segments = node.getStyledTextSegments([
      'fontName',
      'fontSize',
      'textStyleId',
      'boundVariables',
    ])
    for (const segment of segments) {
      const fields: Partial<Record<TypographyField, RawVariable>> = {}
      const variableIds: Record<string, string> = {}
      const segmentBound = (segment.boundVariables ?? {}) as Record<
        string,
        VariableAlias | undefined
      >
      for (const [field, alias] of Object.entries(segmentBound)) {
        if (!alias || field === 'fontStyle' || field === 'paragraphIndent') {
          continue
        }
        const variable = await this.rawVariable(alias.id, node, modes)
        if (variable) {
          fields[field as TypographyField] = variable
          variableIds[field] = alias.id
        }
      }
      const textStyle = segment.textStyleId
        ? ((await this.textStyle(segment.textStyleId)) ?? undefined)
        : undefined
      if (Object.keys(fields).length === 0 && !textStyle) continue
      const property: PropertyRef =
        segments.length > 1
          ? { type: 'typography', range: [segment.start, segment.end] }
          : { type: 'typography' }
      const override = await owns(property, (counterpart) =>
        textTypographyHas(
          counterpart,
          variableIds,
          segment.textStyleId || undefined,
        ),
      )
      push({
        ...base,
        ...(override ? { override: true } : {}),
        unit: 'typography',
        property,
        fields,
        font: {
          family: segment.fontName.family,
          style: segment.fontName.style,
        },
        fontSize: segment.fontSize,
        textStyle,
      })
    }
  }

  /** The topmost visible fill of a node, as the fill under its children. */
  private async visibleFill(
    node: SceneNode,
    modes: Modes,
    context: Omit<RoleContext, 'fillUnder'>,
  ): Promise<RawFillUnder | undefined> {
    if (!('fills' in node) || node.fills === figma.mixed || !node.visible) {
      return undefined
    }
    const visible = node.fills.filter(
      (paint) => paint.visible !== false && (paint.opacity ?? 1) > 0,
    )
    const top = visible[visible.length - 1]
    if (!top) return undefined
    const alias = top.type === 'SOLID' ? top.boundVariables?.color : undefined
    const variable = alias
      ? await this.rawVariable(alias.id, node, modes)
      : undefined
    return variable ? { variable, context } : { context }
  }
}

function isRgba(value: unknown): value is RGBA {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    'g' in value &&
    'b' in value
  )
}

/** #rrggbb, or #rrggbbaa when the colour is not opaque. */
function toHex({ r, g, b, a }: RGBA): string {
  const byte = (channel: number) =>
    Math.round(Math.max(0, Math.min(1, channel)) * 255)
      .toString(16)
      .padStart(2, '0')
  const alpha = a === undefined || a >= 1 ? '' : byte(a)
  return `#${byte(r)}${byte(g)}${byte(b)}${alpha}`
}

/** A text is on one line when it has no line break and is not taller than about one line. */
function isSingleLine(node: TextNode): boolean {
  // Line feed and line separator, written as char codes so the bundle has
  // no escapes (see vite.fixture.config.ts).
  const breaks = [10, 0x2028].map((code) => String.fromCharCode(code))
  if (breaks.some((character) => node.characters.includes(character))) {
    return false
  }
  if (node.textAutoResize === 'WIDTH_AND_HEIGHT') return true
  const size = typeof node.fontSize === 'number' ? node.fontSize : 14
  return node.height < size * 2.2
}

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
  /** True inside a local component, whose nested components are not split off */
  inComponent: boolean
  isRoot: boolean
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
  | 'context'
>

export type FoundInstance = {
  id: string
  name: string
  entryId: string
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
        inComponent,
        isRoot: true,
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
    if (
      this.options.oldKeys.has(collectionKey) &&
      collectionKey !== this.options.densityKey &&
      variable.resolvedType !== 'COLOR'
    ) {
      raw.chain = await this.chain(variable, modes)
      const reachesDensity = raw.chain.some(
        (step) => step.collectionKey === this.options.densityKey,
      )
      if (!reachesDensity && variable.resolvedType === 'FLOAT') {
        try {
          const resolved = variable.resolveForConsumer(node).value
          if (typeof resolved === 'number') raw.resolvedValue = resolved
        } catch {
          // The value could not be resolved for this node; the rules do without it.
        }
      }
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
    const instanceId =
      state.instanceId ?? (node.type === 'INSTANCE' ? node.id : undefined)
    if (node.type === 'INSTANCE' && !state.instanceId) {
      this.instances.set(node.id, {
        id: node.id,
        name: node.name,
        entryId: state.entryId,
      })
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
    }
    const push = (unit: RawUnit) => this.units.push(unit)

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
      push({
        ...base,
        unit: 'variable',
        kind: FIELD_KINDS[field] ?? 'other',
        property: { type: 'field', field },
        variable,
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
          push({
            ...base,
            unit: 'variable',
            kind: field === 'color' ? 'effect' : 'other',
            property: { type: 'effect', index, field },
            variable,
          })
        }
      }
    }

    // Typography
    if (node.type === 'TEXT') await this.typography(node, modes, base, push)

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
        inComponent:
          state.inComponent ||
          node.type === 'COMPONENT' ||
          node.type === 'COMPONENT_SET',
        isRoot: false,
      }
      for (const child of node.children) await this.walk(child, childState)
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
      push({ ...base, unit: 'variable', kind, property, variable })
    }
  }

  private async typography(
    node: TextNode,
    modes: Modes,
    base: UnitBase,
    push: (unit: RawUnit) => void,
  ): Promise<void> {
    const segments = node.getStyledTextSegments([
      'fontName',
      'fontSize',
      'textStyleId',
      'boundVariables',
    ])
    for (const segment of segments) {
      const fields: Partial<Record<TypographyField, RawVariable>> = {}
      const segmentBound = (segment.boundVariables ?? {}) as Record<
        string,
        VariableAlias | undefined
      >
      for (const [field, alias] of Object.entries(segmentBound)) {
        if (!alias || field === 'fontStyle' || field === 'paragraphIndent') {
          continue
        }
        const variable = await this.rawVariable(alias.id, node, modes)
        if (variable) fields[field as TypographyField] = variable
      }
      const textStyle = segment.textStyleId
        ? ((await this.textStyle(segment.textStyleId)) ?? undefined)
        : undefined
      if (Object.keys(fields).length === 0 && !textStyle) continue
      push({
        ...base,
        unit: 'typography',
        property:
          segments.length > 1
            ? { type: 'typography', range: [segment.start, segment.end] }
            : { type: 'typography' },
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

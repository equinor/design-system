/**
 * Tells a value an instance sets itself, an override, from a value it takes
 * from its main component.
 *
 * `InstanceNode.overrides` on the outermost instance lists every layer below
 * it, the instance included, with the fields this instance overrides.
 * Overrides it inherits from its main component are not in the list, so a
 * Text Field placed in a frame does not list the bindings the Text Field
 * main component sets on its icon. The list names `boundVariables` for any
 * bound field, so it cannot say which field changed. The layer at the same
 * place in the main component settles that: the value is an override when
 * that layer binds another variable, or when there is no such layer, as
 * below a swapped instance. Checked in EDS Core Components on 2026-11-13.
 */
import type { PropertyRef } from '../../scan/types'

/** Reads whether the layer at the same place in the main component has the same binding. */
export type SameBinding = (counterpart: SceneNode) => boolean

/** The names in `overrides` that a change to each kind of binding shows up under. */
function overrideFields(property: PropertyRef): string[] {
  switch (property.type) {
    case 'field':
      // Figma spells the top stroke weight `stokeTopWeight` in this list.
      return property.field === 'strokeTopWeight'
        ? ['boundVariables', property.field, 'stokeTopWeight']
        : ['boundVariables', property.field]
    case 'paint':
      return [
        property.field,
        property.field === 'fills' ? 'fillStyleId' : 'strokeStyleId',
        ...(property.range ? ['styledTextSegments'] : []),
      ]
    case 'effect':
      return ['effects', 'effectStyleId']
    case 'typography':
      return [
        'boundVariables',
        'textStyleId',
        'fontName',
        'fontSize',
        'lineHeight',
        'letterSpacing',
        'paragraphSpacing',
        'styledTextSegments',
      ]
    case 'mode':
      return []
  }
}

type InstanceInfo = {
  /** Layer id → the fields the instance overrides on it */
  overridden: Map<string, Set<string>>
  main?: Promise<ComponentNode | null>
}

export class InstanceOverrides {
  private readonly infos = new Map<string, InstanceInfo>()

  private info(instance: InstanceNode): InstanceInfo {
    let found = this.infos.get(instance.id)
    if (!found) {
      const overridden = new Map<string, Set<string>>()
      for (const { id, overriddenFields } of instance.overrides) {
        overridden.set(id, new Set<string>(overriddenFields))
      }
      found = { overridden }
      this.infos.set(instance.id, found)
    }
    return found
  }

  /** The layer at the same child position in the main component, or null when there is none. */
  async counterpart(
    instance: InstanceNode,
    path: number[],
  ): Promise<SceneNode | null> {
    const info = this.info(instance)
    info.main ??= instance.getMainComponentAsync().catch(() => null)
    let node: SceneNode | null = await info.main
    for (const index of path) {
      if (!node || !('children' in node)) return null
      node = node.children[index] ?? null
    }
    return node
  }

  /**
   * Whether the instance sets this binding itself. `path` is the child
   * positions from the instance down to the layer, empty for the instance.
   */
  async isOverride(
    instance: InstanceNode,
    nodeId: string,
    path: number[],
    property: PropertyRef,
    same: SameBinding,
  ): Promise<boolean> {
    const fields = this.info(instance).overridden.get(nodeId)
    if (!fields) return false
    if (!overrideFields(property).some((field) => fields.has(field))) {
      return false
    }
    const counterpart = await this.counterpart(instance, path)
    return !counterpart || !same(counterpart)
  }

  /**
   * Whether the instance has its own plugin data on the layer. A layer in an
   * instance reads the plugin data of the main component's layer until the
   * instance sets its own, so without this the main component's change log
   * would read as the instance's.
   */
  ownsPluginData(instance: InstanceNode, nodeId: string): boolean {
    return (
      this.info(instance).overridden.get(nodeId)?.has('pluginData') ?? false
    )
  }
}

function aliasId(value: unknown): string | undefined {
  return typeof value === 'object' &&
    value !== null &&
    (value as { type?: unknown }).type === 'VARIABLE_ALIAS'
    ? (value as VariableAlias).id
    : undefined
}

/** The variable bound to a field of a layer, such as `width` or `paddingLeft`. */
export function fieldVariableId(
  node: SceneNode,
  field: string,
): string | undefined {
  const bound = (node.boundVariables ?? {}) as Record<string, unknown>
  return aliasId(bound[field])
}

/** The variable on the colour of a fill or stroke of a layer. */
export function paintVariableId(
  node: SceneNode,
  field: 'fills' | 'strokes',
  index: number,
): string | undefined {
  if (!(field in node)) return undefined
  const paints = (node as SceneNode & Record<string, unknown>)[field]
  if (!Array.isArray(paints)) return undefined
  const paint = paints[index] as Paint | undefined
  return paint?.type === 'SOLID' ? paint.boundVariables?.color?.id : undefined
}

/** Whether any range of a text has a fill bound to the variable. */
export function textFillHas(
  node: SceneNode,
  index: number,
  variableId: string,
): boolean {
  if (node.type !== 'TEXT') return false
  return node.getStyledTextSegments(['fills']).some((segment) => {
    const paint = segment.fills[index]
    return (
      paint?.type === 'SOLID' && paint.boundVariables?.color?.id === variableId
    )
  })
}

/** The variable on a field of an effect of a layer. */
export function effectVariableId(
  node: SceneNode,
  index: number,
  field: string,
): string | undefined {
  if (!('effects' in node)) return undefined
  const effect = node.effects[index]
  if (!effect || !('boundVariables' in effect)) return undefined
  const bound = (effect.boundVariables ?? {}) as Record<string, unknown>
  return aliasId(bound[field])
}

/**
 * Whether any range of a text has the same typography: the same text style
 * and the same variable on each field.
 */
export function textTypographyHas(
  node: SceneNode,
  variableIds: Record<string, string>,
  textStyleId: string | undefined,
): boolean {
  if (node.type !== 'TEXT') return false
  return node
    .getStyledTextSegments(['boundVariables', 'textStyleId'])
    .some((segment) => {
      if ((segment.textStyleId || undefined) !== textStyleId) return false
      const bound = (segment.boundVariables ?? {}) as Record<string, unknown>
      return Object.entries(variableIds).every(
        ([field, id]) => aliasId(bound[field]) === id,
      )
    })
}

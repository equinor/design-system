/**
 * The fixture format: the raw units of one frame, with the layers and
 * variables they share written once. A raw unit carries the full context of
 * its layer, which repeats for every binding on it; the packed form is about
 * a quarter of the size. `unpackFixture` rebuilds the units exactly.
 */
import type { ChainStep, RoleContext, TypographyField } from '../mapping/types'
import type { PropertyRef, RawTextStyle, RawUnit, RawVariable } from './types'

type PackedVariable = Omit<
  RawVariable,
  'chain' | 'resolvedValue' | 'value' | 'colour'
>

type PackedRef = {
  variable: string
  chain?: ChainStep[]
  resolvedValue?: number | string | boolean | null
  value?: number
  colour?: string
}

type PackedNode = {
  name: string
  type: string
  path: string[]
  context: Omit<RoleContext, 'fillUnder'>
  /** The layer that owns the fill under this one, and the variable on that fill */
  fillUnder?: { owner: string; variable?: string }
  modeHolders?: string[]
}

type PackedUnit = {
  node: string
  entry: string
  property: PropertyRef
  instance?: string
  /** An override of the instance, which the plugin can change */
  override?: true
} & (
  | { unit: 'variable'; kind: string; ref: PackedRef }
  | {
      unit: 'typography'
      fields: Partial<Record<TypographyField, PackedRef>>
      font: { family: string; style: string }
      fontSize: number
      textStyle?: RawTextStyle
    }
  | { unit: 'value'; value: number | null }
  | {
      unit: 'mode'
      collectionId: string
      collectionKey: string
      collectionName: string
      modeId: string
      modeName: string
    }
)

export type PackedFixture = {
  generatedAt: string
  fileName: string
  frame: { id: string; name: string }
  variables: Record<string, PackedVariable>
  nodes: Record<string, PackedNode>
  units: PackedUnit[]
}

export type FixtureHeader = Pick<
  PackedFixture,
  'generatedAt' | 'fileName' | 'frame'
>

function sameContext(
  a: Omit<RoleContext, 'fillUnder'>,
  b: Omit<RoleContext, 'fillUnder'>,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function packFixture(
  header: FixtureHeader,
  units: RawUnit[],
): PackedFixture {
  const variables: Record<string, PackedVariable> = {}
  const nodes: Record<string, PackedNode> = {}
  /** Owner node ids by context, to point a fill under at the layer that owns it */
  const owners: { id: string; context: Omit<RoleContext, 'fillUnder'> }[] = []

  const ref = (variable: RawVariable): PackedRef => {
    const { chain, resolvedValue, value, colour, ...rest } = variable
    variables[variable.id] ??= rest
    const packed: PackedRef = { variable: variable.id }
    if (chain && chain.length > 0) packed.chain = chain
    if (resolvedValue !== undefined) packed.resolvedValue = resolvedValue
    if (value !== undefined) packed.value = value
    if (colour !== undefined) packed.colour = colour
    return packed
  }

  for (const unit of units) {
    const { fillUnder, ...context } = unit.context
    if (!nodes[unit.nodeId]) {
      nodes[unit.nodeId] = {
        name: unit.nodeName,
        type: unit.nodeType,
        path: unit.path,
        context,
        ...(unit.modeHolders ? { modeHolders: unit.modeHolders } : {}),
      }
      owners.push({ id: unit.nodeId, context })
    }
    if (fillUnder && !nodes[unit.nodeId].fillUnder) {
      let owner = owners.find((candidate) =>
        sameContext(candidate.context, fillUnder.context),
      )?.id
      if (!owner) {
        owner = `fill-owner:${Object.keys(nodes).length}`
        nodes[owner] = {
          name: fillUnder.context.names[0] ?? '',
          type: fillUnder.context.nodeType,
          path: [],
          context: fillUnder.context,
        }
        owners.push({ id: owner, context: fillUnder.context })
      }
      nodes[unit.nodeId].fillUnder = {
        owner,
        variable: fillUnder.variable
          ? ref(fillUnder.variable).variable
          : undefined,
      }
    }
  }

  const packedUnits = units.map((unit): PackedUnit => {
    const base = {
      node: unit.nodeId,
      entry: unit.entryId,
      property: unit.property,
      ...(unit.instanceId ? { instance: unit.instanceId } : {}),
      ...(unit.override ? { override: true as const } : {}),
    }
    if (unit.unit === 'variable') {
      return {
        ...base,
        unit: 'variable',
        kind: unit.kind,
        ref: ref(unit.variable),
      }
    }
    if (unit.unit === 'typography') {
      const fields: Partial<Record<TypographyField, PackedRef>> = {}
      for (const [field, variable] of Object.entries(unit.fields)) {
        if (variable) fields[field as TypographyField] = ref(variable)
      }
      return {
        ...base,
        unit: 'typography',
        fields,
        font: unit.font,
        fontSize: unit.fontSize,
        ...(unit.textStyle ? { textStyle: unit.textStyle } : {}),
      }
    }
    if (unit.unit === 'value') {
      return { ...base, unit: 'value', value: unit.value }
    }
    return {
      ...base,
      unit: 'mode',
      collectionId: unit.collectionId,
      collectionKey: unit.collectionKey,
      collectionName: unit.collectionName,
      modeId: unit.modeId,
      modeName: unit.modeName,
    }
  })

  return { ...header, variables, nodes, units: packedUnits }
}

export function unpackFixture(fixture: PackedFixture): RawUnit[] {
  const variable = (packed: PackedRef): RawVariable => {
    const found = fixture.variables[packed.variable]
    if (!found)
      throw new Error(`The fixture has no variable ${packed.variable}`)
    const raw: RawVariable = { ...found }
    if (packed.chain) raw.chain = packed.chain
    if (packed.resolvedValue !== undefined)
      raw.resolvedValue = packed.resolvedValue
    if (packed.value !== undefined) raw.value = packed.value
    if (packed.colour !== undefined) raw.colour = packed.colour
    return raw
  }

  return fixture.units.map((unit): RawUnit => {
    const node = fixture.nodes[unit.node]
    if (!node) throw new Error(`The fixture has no layer ${unit.node}`)
    const context: RawUnit['context'] = { ...node.context }
    if (node.fillUnder) {
      const owner = fixture.nodes[node.fillUnder.owner]
      context.fillUnder = {
        context: owner.context,
        ...(node.fillUnder.variable
          ? { variable: variable({ variable: node.fillUnder.variable }) }
          : {}),
      }
    }
    const base = {
      nodeId: unit.node,
      nodeName: node.name,
      nodeType: node.type,
      entryId: unit.entry,
      path: node.path,
      property: unit.property,
      instanceId: unit.instance,
      ...(unit.override ? { override: true as const } : {}),
      context,
      ...(node.modeHolders ? { modeHolders: node.modeHolders } : {}),
    }
    if (unit.unit === 'variable') {
      return {
        ...base,
        unit: 'variable',
        kind: unit.kind as Extract<RawUnit, { unit: 'variable' }>['kind'],
        variable: variable(unit.ref),
      }
    }
    if (unit.unit === 'typography') {
      const fields: Partial<Record<TypographyField, RawVariable>> = {}
      for (const [field, ref] of Object.entries(unit.fields)) {
        if (ref) fields[field as TypographyField] = variable(ref)
      }
      return {
        ...base,
        unit: 'typography',
        fields,
        font: unit.font,
        fontSize: unit.fontSize,
        textStyle: unit.textStyle,
      }
    }
    if (unit.unit === 'value') {
      return { ...base, unit: 'value', value: unit.value }
    }
    return {
      ...base,
      unit: 'mode',
      collectionId: unit.collectionId,
      collectionKey: unit.collectionKey,
      collectionName: unit.collectionName,
      modeId: unit.modeId,
      modeName: unit.modeName,
    }
  })
}

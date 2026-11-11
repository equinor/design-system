/**
 * Turns the raw units of a scan into records: which category each one is in,
 * and for old variables outside instances, what the rules propose.
 */
import { collectionOrigin, isNewTextStyleKey } from '../mapping/inventory'
import {
  resolveMode,
  resolveTypography,
  resolveVariable,
} from '../mapping/rules'
import type {
  OldVariable,
  RoleContext,
  TypographyField,
} from '../mapping/types'
import type {
  BindingRecord,
  PropertyGroup,
  PropertyRef,
  RawContext,
  RawUnit,
  RawVariable,
} from './types'

export function propertyKey(property: PropertyRef): string {
  switch (property.type) {
    case 'paint':
      return `${property.field}[${property.index}]${property.range ? `@${property.range.join('-')}` : ''}`
    case 'effect':
      return `effects[${property.index}].${property.field}`
    case 'field':
      return property.field
    case 'typography':
      return `typography${property.range ? `@${property.range.join('-')}` : ''}`
    case 'mode':
      return `mode:${property.collectionId}`
  }
}

export function toOldVariable(variable: RawVariable): OldVariable {
  return {
    collectionKey: variable.collectionKey,
    name: variable.name,
    type: variable.type,
    chain: variable.chain,
    resolvedValue: variable.resolvedValue,
  }
}

export function toRoleContext(raw: RawContext): RoleContext {
  const { fillUnder, ...rest } = raw
  if (!fillUnder) return rest
  const variable = fillUnder.variable
  const origin = variable ? collectionOrigin(variable.collectionKey) : 'other'
  return {
    ...rest,
    fillUnder: {
      context: fillUnder.context,
      oldVariable:
        variable && origin === 'old' ? toOldVariable(variable) : undefined,
      newVariableName: variable && origin === 'new' ? variable.name : undefined,
    },
  }
}

function describe(variable: RawVariable): string {
  return variable.collectionName
    ? `${variable.name} (${variable.collectionName})`
    : variable.name
}

export function groupOf(unit: RawUnit): PropertyGroup {
  if (unit.unit === 'typography') return 'typography'
  if (unit.unit === 'mode') return 'modes'
  switch (unit.kind) {
    case 'fill':
    case 'stroke':
    case 'effect':
    case 'textFill':
      return 'colour'
    case 'spacing':
      return 'spacing'
    case 'size':
      return 'size'
    case 'radius':
      return 'radius'
    default:
      return 'other'
  }
}

/** Classifies one unit, or returns null when it is not counted (text with no bound typography). */
export function classifyUnit(unit: RawUnit): BindingRecord | null {
  const base = {
    id: `${unit.nodeId}|${propertyKey(unit.property)}`,
    nodeId: unit.nodeId,
    nodeName: unit.nodeName,
    nodeType: unit.nodeType,
    entryId: unit.entryId,
    path: unit.path,
    property: unit.property,
    group: groupOf(unit),
    instanceId: unit.instanceId,
  }

  if (unit.unit === 'variable') {
    const { variable } = unit
    const origin = collectionOrigin(variable.collectionKey)
    if (origin === 'new') {
      return { ...base, category: 'migrated', current: variable.name }
    }
    if (origin === 'other') {
      return { ...base, category: 'other', current: describe(variable) }
    }
    const old = { old: variable.name, oldCollection: variable.collectionName }
    if (unit.instanceId) return { ...base, ...old, category: 'inInstance' }
    const resolution = resolveVariable({
      kind: unit.kind,
      variable: toOldVariable(variable),
      context: toRoleContext(unit.context),
    })
    return {
      ...base,
      ...old,
      category: resolution.outcome,
      outcome: resolution.outcome,
      candidates: resolution.candidates,
      reason: resolution.reason,
      rule: resolution.rule,
    }
  }

  if (unit.unit === 'typography') {
    const entries = Object.entries(unit.fields) as [
      TypographyField,
      RawVariable,
    ][]
    const oldFields = entries.filter(
      ([, variable]) => collectionOrigin(variable.collectionKey) === 'old',
    )
    if (oldFields.length > 0) {
      const old = {
        old: oldFields.map(([, variable]) => variable.name).join(', '),
        oldCollection: [
          ...new Set(oldFields.map(([, variable]) => variable.collectionName)),
        ].join(', '),
      }
      if (unit.instanceId) return { ...base, ...old, category: 'inInstance' }
      const resolution = resolveTypography({
        fields: Object.fromEntries(
          oldFields.map(([field, variable]) => [
            field,
            toOldVariable(variable),
          ]),
        ),
        font: unit.font,
        fontSize: unit.fontSize,
        context: toRoleContext(unit.context),
      })
      return {
        ...base,
        ...old,
        category: resolution.outcome,
        outcome: resolution.outcome,
        candidates: resolution.candidates,
        reason: resolution.reason,
        rule: resolution.rule,
      }
    }
    if (unit.textStyle && isNewTextStyleKey(unit.textStyle.key)) {
      return { ...base, category: 'migrated', current: unit.textStyle.name }
    }
    const newField = entries.find(
      ([, variable]) => collectionOrigin(variable.collectionKey) === 'new',
    )
    if (newField) {
      return { ...base, category: 'migrated', current: newField[1].name }
    }
    if (entries.length > 0) {
      return {
        ...base,
        category: 'other',
        current: entries.map(([, variable]) => describe(variable)).join(', '),
      }
    }
    return null
  }

  const origin = collectionOrigin(unit.collectionKey)
  const label = `${unit.collectionName}: ${unit.modeName}`
  if (origin === 'new') return { ...base, category: 'migrated', current: label }
  if (origin === 'other') return { ...base, category: 'other', current: label }
  const old = { old: unit.modeName, oldCollection: unit.collectionName }
  if (unit.instanceId) return { ...base, ...old, category: 'inInstance' }
  const resolution = resolveMode({
    collectionKey: unit.collectionKey,
    modeName: unit.modeName,
  })
  return {
    ...base,
    ...old,
    category: resolution.outcome,
    outcome: resolution.outcome,
    candidates: resolution.target
      ? [`${resolution.target.collection}: ${resolution.target.mode}`]
      : [],
    reason: resolution.reason,
    rule: resolution.rule,
  }
}

export function classifyUnits(units: RawUnit[]): BindingRecord[] {
  return units
    .map(classifyUnit)
    .filter((record): record is BindingRecord => record !== null)
}

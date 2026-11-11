/**
 * Turns the raw units of a scan into records: which category each one is in,
 * and for old variables outside instances, what the rules propose.
 */
import {
  collectionOrigin,
  isNewTextStyleKey,
  OLD,
  oldCollectionInfo,
} from '../mapping/inventory'
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

/** The target of a legacy mode that is only cleared, with no new mode set. */
export const CLEAR_MODE = 'clear'

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
    ...(unit.modeHolders ? { modeHolders: unit.modeHolders } : {}),
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
    const old = {
      kind: unit.kind,
      oldKey: `${variable.collectionKey}/${variable.name}`,
      old: variable.name,
      oldCollection: variable.collectionName,
      oldVariable: { id: variable.id, key: variable.key, name: variable.name },
    }
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
      const names = oldFields
        .map(([, variable]) => variable.name)
        .sort((a, b) => a.localeCompare(b, 'en'))
      const old = {
        oldKey: `typography:${names.join('|')}`,
        old: names.join(', '),
        oldCollection: [
          ...new Set(oldFields.map(([, variable]) => variable.collectionName)),
        ].join(', '),
        oldFont: unit.font,
        oldFields: Object.fromEntries(
          oldFields.map(([field, variable]) => [
            field,
            { key: variable.key, name: variable.name },
          ]),
        ),
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
  const old = {
    oldKey: `mode:${unit.collectionKey}:${unit.modeName}`,
    old: unit.modeName,
    oldCollection: unit.collectionName,
    oldMode: {
      collectionId: unit.collectionId,
      collectionKey: unit.collectionKey,
      modeId: unit.modeId,
      modeName: unit.modeName,
    },
  }
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
      : resolution.outcome === 'sure'
        ? [CLEAR_MODE]
        : [],
    reason: resolution.reason,
    rule: resolution.rule,
  }
}

/** Colour modes only matter to colour variables, and spacing and typography modes to the rest. */
function libraryGroup(collectionKey: string): 'colour' | 'spacing' | undefined {
  const info = oldCollectionInfo(collectionKey)
  if (!info) return undefined
  return info.libraryId.startsWith('colours') ? 'colour' : 'spacing'
}

/** The collection key of a legacy binding, for variables and typography. */
function bindingCollectionKey(record: BindingRecord): string | undefined {
  if (record.property.type === 'typography') return OLD.density
  if (record.oldKey?.startsWith('typography:')) return OLD.density
  if (record.oldKey?.startsWith('mode:')) return undefined
  return record.oldKey?.split('/')[0]
}

/**
 * The legacy modes that have to stay, as `nodeId|collectionKey`. A legacy
 * binding that stays resolves through the nearest legacy mode above it of a
 * collection in its own library, so that mode cannot be cleared.
 */
export function blockedModes(
  records: BindingRecord[],
  stays: (record: BindingRecord) => boolean,
): Set<string> {
  const held = new Map<string, string[]>()
  for (const record of records) {
    if (record.property.type !== 'mode' || !record.oldMode) continue
    const list = held.get(record.nodeId) ?? []
    list.push(record.oldMode.collectionKey)
    held.set(record.nodeId, list)
  }
  const blocked = new Set<string>()
  for (const record of records) {
    if (record.property.type === 'mode' || !stays(record)) continue
    const key = bindingCollectionKey(record)
    const group = key ? libraryGroup(key) : undefined
    if (!group) continue
    const claimed = new Set<string>()
    for (const holder of [...(record.modeHolders ?? [])].reverse()) {
      for (const collection of held.get(holder) ?? []) {
        if (claimed.has(collection) || libraryGroup(collection) !== group) {
          continue
        }
        claimed.add(collection)
        blocked.add(`${holder}|${collection}`)
      }
    }
  }
  return blocked
}

/** Bindings that will not change: inside instances, or with no equivalent. */
function staysAsItIs(record: BindingRecord): boolean {
  return record.category === 'inInstance' || record.category === 'none'
}

/**
 * A legacy mode can only be cleared once nothing below it uses a legacy
 * variable through it, including inside instances: an instance still
 * resolves its legacy variables through the mode. A mode above a binding
 * that will not change stays for good; a mode above a binding that needs a
 * check stays until the binding is reviewed and applied. A mode that sets a
 * new one is still applied, and keeps the legacy mode beside it. A mode
 * with nothing to do now counts as No equivalent, with the reason, so Apply
 * never offers a change that changes nothing.
 */
export function holdModes(records: BindingRecord[]): BindingRecord[] {
  const forGood = blockedModes(records, staysAsItIs)
  const untilReview = blockedModes(
    records,
    (record) => record.category === 'check',
  )
  const newModes = new Set(
    records
      .filter(
        (record) =>
          record.property.type === 'mode' && record.category === 'migrated',
      )
      .map((record) => `${record.nodeId}|${record.current?.split(':')[0]}`),
  )
  return records.map((record) => {
    if (
      record.property.type !== 'mode' ||
      record.category !== 'sure' ||
      !record.oldMode
    ) {
      return record
    }
    const key = `${record.nodeId}|${record.oldMode.collectionKey}`
    const stays = forGood.has(key)
      ? 'The legacy mode stays while layers below use legacy variables that are not changed, inside instances or with no equivalent.'
      : untilReview.has(key)
        ? 'The legacy mode is cleared once the bindings below that need a check are reviewed and applied.'
        : undefined
    if (!stays) return record
    const target = record.candidates?.[0]
    const setsMode = target !== undefined && target !== CLEAR_MODE
    const alreadySet =
      setsMode && newModes.has(`${record.nodeId}|${target.split(':')[0]}`)
    if (setsMode && !alreadySet) {
      return { ...record, reason: `${record.reason ?? ''}. ${stays}` }
    }
    return {
      ...record,
      category: 'none',
      outcome: 'none',
      candidates: [],
      reason: stays,
      rule: forGood.has(key) ? 'mode/kept' : 'mode/after-review',
    }
  })
}

export function classifyUnits(units: RawUnit[]): BindingRecord[] {
  return holdModes(
    units
      .map(classifyUnit)
      .filter((record): record is BindingRecord => record !== null),
  )
}

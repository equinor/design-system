/**
 * Typography conversion as rows with targets (decisions A and B,
 * 2026-11-16). Convert on the Typography tab replaces an instance of the
 * legacy Typography component with a text layer, which gets a text style and
 * a colour. Those are decided at scan time, as records the tab lists like
 * Changes, so a designer sees and can change them before converting.
 *
 * The records are kept apart from the scan's records. The instance's values
 * count as Inside instances in the health until it is converted, and a
 * second record for the same value would count it twice.
 */
import { getNewTextStyle } from '../mapping/inventory'
import type { TextCase } from '../mapping/types'
import { classifyUnit } from './classify'
import { isMappable } from './mapping'
import type { BindingRecord, OldInstance, RawUnit } from './types'

/** The two values a conversion sets on the new text layer. */
export type ConversionPart = 'typography' | 'fill'

/** The id of a conversion record: `convert:<instanceId>|typography` or `|fill`. */
export function conversionId(instanceId: string, part: ConversionPart): string {
  return `convert:${instanceId}|${part}`
}

/** True for a record made by conversionRecords. */
export function isConversionId(id: string): boolean {
  return id.startsWith('convert:')
}

/** A Typography instance with what the scan read about it. */
export type ConversionSource = Pick<
  OldInstance,
  'id' | 'name' | 'entryId' | 'text'
> & {
  /** The text layer in the instance, which the conversion replaces */
  textId: string
  /** Layer names from the entry down to the instance's parent */
  path: string[]
}

/**
 * The text case an EDS Beta text style sets. The inventory records none
 * (export of 2026-11-11), so every style is ORIGINAL: the text shows as
 * typed.
 */
export function styleTextCase(name: string): TextCase {
  return getNewTextStyle(name)?.textCase ?? 'ORIGINAL'
}

/**
 * True when converting with the text style `style` drops the text case of
 * the legacy text, which the conversion's text style record keeps.
 */
export function dropsTextCase(record: BindingRecord, style: string): boolean {
  return (record.textCase ?? 'ORIGINAL') !== styleTextCase(style)
}

const CASE_WORDS: Record<TextCase | 'MIXED', string> = {
  ORIGINAL: 'no text case',
  UPPER: 'upper case',
  LOWER: 'lower case',
  TITLE: 'title case',
  SMALL_CAPS: 'small caps',
  SMALL_CAPS_FORCED: 'forced small caps',
  MIXED: 'more than one text case',
}

/**
 * Decision B: a text case that differs from the style's makes the text
 * style Needs check. Figma detaches a text style from a layer once a style
 * property such as the case is set on it, so the conversion keeps the style
 * and drops the case. The designer confirms that, chooses another style, or
 * decides later.
 */
function withTextCase(
  given: BindingRecord,
  textCase: TextCase | 'MIXED' | undefined,
): BindingRecord {
  const legacy = textCase ?? 'ORIGINAL'
  // Kept on the record, so the Convert confirmation can count the cases a
  // conversion drops with the style a designer chose (previewConversions).
  const record: BindingRecord =
    legacy === 'ORIGINAL' ? given : { ...given, textCase: legacy }
  const style = record.candidates?.[0]
  if (!style) return record
  const target = styleTextCase(style)
  if (legacy === target) return record
  const reason = `The legacy text has ${CASE_WORDS[legacy]}, and the text style ${style} has ${CASE_WORDS[target]}. Setting a text case on the new text layer would detach its text style in Figma, so the conversion keeps the style and drops the case.`
  return {
    ...record,
    category: record.category === 'sure' ? 'check' : record.category,
    ...(record.outcome === 'sure' ? { outcome: 'check' as const } : {}),
    reason: record.reason ? `${reason} ${record.reason}` : reason,
  }
}

/**
 * The records of the conversions: for each Typography instance, the
 * typography and the text colour of its text layer, classified as if the
 * text were not in an instance. The rules give the same text style and
 * colour as for a text layer of its own, which is what the instance becomes.
 *
 * A record stands for the instance: its node is the instance, so a row
 * selects it, and its name is the instance's text, which tells the
 * instances apart. Its legacy key starts with `convert:`, so a choice on a
 * row in Changes and one on a row of the Typography tab never reach each
 * other's values. Only values a designer can decide on are kept: a text
 * already in an EDS Beta style gives no record.
 */
export function conversionRecords(
  instances: ConversionSource[],
  units: RawUnit[],
): BindingRecord[] {
  const byText = new Map<string, ConversionSource>(
    instances.map((instance) => [instance.textId, instance]),
  )
  // The first typography and the first text colour of each text, as
  // Convert reads them.
  const found = new Map<string, Partial<Record<ConversionPart, RawUnit>>>()
  for (const unit of units) {
    const instance = byText.get(unit.nodeId)
    if (!instance || unit.instanceId !== instance.id) continue
    const part: ConversionPart | undefined =
      unit.unit === 'typography'
        ? 'typography'
        : unit.unit === 'variable' && unit.kind === 'textFill'
          ? 'fill'
          : undefined
    if (!part) continue
    const parts = found.get(instance.id) ?? {}
    parts[part] ??= unit
    found.set(instance.id, parts)
  }

  const records: BindingRecord[] = []
  for (const instance of instances) {
    const parts = found.get(instance.id) ?? {}
    for (const part of ['typography', 'fill'] as const) {
      const unit = parts[part]
      if (!unit) continue
      const classified = classifyUnit({
        ...unit,
        instanceId: undefined,
        override: undefined,
      })
      if (!classified || !isMappable(classified)) continue
      const record: BindingRecord = {
        ...classified,
        id: conversionId(instance.id, part),
        nodeId: instance.id,
        nodeName: instance.text ? `“${instance.text}”` : instance.name,
        nodeType: 'INSTANCE',
        entryId: instance.entryId,
        path: instance.path,
        oldKey: `convert:${classified.oldKey}`,
      }
      records.push(
        unit.unit === 'typography'
          ? withTextCase(record, unit.textCase)
          : record,
      )
    }
  }
  return records
}

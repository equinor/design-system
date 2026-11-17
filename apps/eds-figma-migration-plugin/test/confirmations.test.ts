/**
 * The confirmations say everything a run writes (phase 8, 2026-11-17): the
 * Apply confirmations say what changes inside instances from the preview,
 * every confirmation names the change log the run writes, and Convert on
 * the Typography tab gets a confirmation with counts from its plan.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import {
  NO_LEGACY_TYPOGRAPHY,
  planConversions,
  previewConversions,
  previewRun,
} from '../src/scan/apply-plan'
import type { RunPreview } from '../src/scan/apply-plan'
import { classifyUnits } from '../src/scan/classify'
import { conversionId } from '../src/scan/conversions'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'
import { DECIDE_LATER, NO_OVERRIDES } from '../src/scan/mapping'
import type { Overrides } from '../src/scan/mapping'
import type { BindingRecord, OldInstance } from '../src/scan/types'
import {
  applyDisabled,
  applyText,
  changeLogLine,
  convertDisabled,
  convertText,
  reviewLaterLine,
} from '../src/ui/preview'
import type { ConfirmationText } from '../src/ui/preview'

const FRAME = new Set(['frame'])

/** Every sentence and list item of a confirmation, in the order the dialog shows them. */
function allText(text: ConfirmationText): string[] {
  return [
    ...(text.lead ? [text.lead] : []),
    ...(typeof text.changes === 'string'
      ? [text.changes]
      : [text.changes.lead, ...text.changes.items]),
    ...text.details,
    ...text.lists.flatMap((list) => [list.lead, ...list.items]),
    ...text.notes,
    text.footnote,
  ]
}

/** What the confirmations said before phase 8, whatever changed inside instances. */
const NOTHING_IN_INSTANCES =
  /nothing inside an instance|changes nothing in an instance/i

const binding = (
  id: string,
  category: BindingRecord['category'],
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id,
  nodeId: id,
  nodeName: id,
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: { type: 'field', field: 'paddingLeft' },
  group: 'spacing',
  kind: 'spacing',
  category,
  oldKey: `${OLD.spacingSemantic}/Container/Space horizontal`,
  old: 'Container/Space horizontal',
  candidates: category === 'none' ? [] : ['spacing/md'],
  ...options,
})

/** An instance with legacy values from its main component. */
const instance = (
  id: string,
  options: Partial<OldInstance> = {},
): OldInstance => ({
  id,
  name: id,
  entryId: 'frame',
  count: 1,
  mainComponent: { name: id, key: `key-${id}`, remote: false },
  ...options,
})

const instances: OldInstance[] = [
  instance('local'),
  instance('library', {
    mainComponent: { name: 'Chip', key: 'chip', remote: true },
  }),
  instance('type', {
    typography: true,
    mainComponent: { name: 'Typography', key: 'typography', remote: true },
  }),
]

/** A frame with a value of its own, two changes inside an instance and values from main components. */
const records: BindingRecord[] = [
  binding('pad', 'sure'),
  binding('overridden', 'sure', { instanceId: 'wrapper', override: true }),
  binding('icon', 'byHand', {
    property: { type: 'field', field: 'width' },
    candidates: ['reset:spacing/md'],
    instanceId: 'wrapper',
    override: true,
  }),
  binding('fromFile', 'inInstance', { instanceId: 'local' }),
  binding('fromLibrary', 'inInstance', { instanceId: 'library' }),
  binding('fromLibrary2', 'inInstance', { instanceId: 'library' }),
  binding('fromType', 'inInstance', { instanceId: 'type' }),
  binding('elsewhere', 'inInstance', { instanceId: 'local', entryId: 'other' }),
]
const accepted: Overrides = {
  records: { icon: 'reset:spacing/md' },
  rows: {},
}

describe('previewRun, values instances take from their main component', () => {
  it('counts them in the entries by where they change', () => {
    const preview = previewRun(records, accepted, FRAME, undefined, instances)
    expect(preview.fromMain).toEqual({ file: 1, library: 2, typography: 1 })
    // They are never part of the run.
    expect(preview.changes).toBe(3)
  })

  it('counts only the selected ones on Apply on ticked values', () => {
    const preview = previewRun(
      records,
      accepted,
      FRAME,
      new Set(['pad', 'fromType']),
      instances,
    )
    expect(preview.fromMain).toEqual({ file: 0, library: 0, typography: 1 })
  })
})

describe('the Apply confirmation', () => {
  const preview = previewRun(records, accepted, FRAME, undefined, instances)

  it('names the values an instance overrides and the reset when the preview has them', () => {
    const text = applyText(preview, { revertLabel: 'Revert frame' })
    expect(text.changes).toEqual({
      lead: 'This run makes these changes:',
      items: [
        '3 values bound to EDS Beta variables',
        '1 layer inside an instance reset for a Manual fix',
      ],
    })
    expect(text.details).toEqual([
      '2 of these changes are values an instance overrides, so they change in the instance that overrides them.',
      'The reset for the Manual fix also removes the other overrides on that layer and the layers below it, and the plugin puts each one back as it is now.',
      'The plugin does not change the legacy value an instance takes from its main component in this file: it changes with the main component.',
      'The plugin does not change the 2 legacy values in instances of library components: swap those instances to EDS Beta components in Figma.',
      'The plugin does not change the legacy value in a Typography instance here: convert the instance on the Typography tab.',
    ])
    for (const line of allText(text)) {
      expect(line).not.toMatch(NOTHING_IN_INSTANCES)
    }
  })

  it('says the change log is an override inside an instance when the run changes one', () => {
    const text = applyText(preview, {
      revertLabel: 'Revert frame',
      later: reviewLaterLine(2),
    })
    expect(text.footnote).toBe(
      "2 values to review are left for a later run: review them, then apply again. Undo with Ctrl or Cmd+Z. The plugin notes each change in the layer's plugin data, so Revert frame can undo it later, and inside an instance that note is an override of the instance.",
    )
  })

  it('names the change log without instances when the run changes nothing inside one', () => {
    const outside = previewRun([binding('pad', 'sure')], NO_OVERRIDES, FRAME)
    const text = applyText(outside, { revertLabel: 'Revert main component' })
    expect(text.details).toEqual([])
    expect(text.footnote).toBe(
      `Undo with Ctrl or Cmd+Z. ${changeLogLine('Revert main component', false)}`,
    )
    expect(text.footnote).toContain(
      "The plugin notes each change in the layer's plugin data, so Revert main component can undo it later.",
    )
    expect(text.footnote).not.toMatch(/override/)
  })

  it('keeps the note on the main components and their instances', () => {
    const text = applyText(preview, {
      revertLabel: 'Revert main component',
      mainComponents: { count: 2, instances: 5 },
    })
    expect(text.notes).toEqual([
      'The 2 main components are used 5 times in the file. Every instance changes with them, and keeps the text and other overrides set in it.',
    ])
  })

  it('says what Apply on ticked values leaves, from the legacy modes removed anyway', () => {
    expect(
      applyText(preview, { revertLabel: 'Revert frame', selected: true }).lead,
    ).toBe(
      'This run changes the selected values that are Ready, and nothing else in the scope.',
    )
    const anyway: RunPreview = {
      ...preview,
      modesRemovedAnyway: [
        {
          id: 'card|mode',
          layer: 'Card',
          mode: 'Density: Spacious',
          below: 'Icon, width',
        },
      ],
    }
    const text = applyText(anyway, {
      revertLabel: 'Revert frame',
      selected: true,
    })
    expect(text.lead).toBe(
      'This run changes the selected values that are Ready, and the legacy values below the modes you chose to remove anyway.',
    )
    expect(text.lists[0]).toEqual({
      lead: 'You chose to remove 1 legacy mode anyway:',
      items: [
        'Density: Spacious on Card is removed anyway, so the legacy values below that read it change: Icon, width.',
      ],
    })
  })

  it('names five kept legacy modes and counts the rest', () => {
    const kept: RunPreview = {
      ...preview,
      modesKept: Array.from({ length: 7 }, (_, index) => ({
        id: `mode-${index}`,
        layer: `Card ${index}`,
        mode: 'Density: Spacious',
        setsMode: false,
        waitsFor: 'Icon, width is decided',
      })),
    }
    const [list] = applyText(kept, { revertLabel: 'Revert frame' }).lists
    expect(list.lead).toBe(
      '7 legacy modes stay, because values below them that read them are not changed in this run:',
    )
    expect(list.items).toHaveLength(6)
    expect(list.items[5]).toBe('and 2 more')
  })

  it('never says nothing inside an instance changes, on the test frame', () => {
    const fixture = JSON.parse(
      readFileSync(
        new URL('./fixtures/test-frame.json', import.meta.url),
        'utf8',
      ),
    ) as PackedFixture
    const scanned = classifyUnits(unpackFixture(fixture))
    const entries = new Set(scanned.map((record) => record.entryId))
    const full = previewRun(scanned, NO_OVERRIDES, entries)
    const text = applyText(full, {
      revertLabel: 'Revert frame',
      mainComponents: { count: 1, instances: 3 },
    })
    for (const line of allText(text)) {
      expect(line).not.toMatch(NOTHING_IN_INSTANCES)
    }
    if (full.inInstances > 0) {
      expect(text.details[0]).toMatch(/an instance overrides/)
      expect(text.footnote).toMatch(/override of the instance/)
    }
  })

  it('waits for the preview, and has nothing to apply at zero', () => {
    expect(applyDisabled(undefined)).toBe(true)
    expect(applyDisabled(preview)).toBe(false)
    const none = previewRun([], NO_OVERRIDES, FRAME)
    expect(applyDisabled(none)).toBe(true)
    expect(applyText(none, { revertLabel: 'Revert frame' }).changes).toBe(
      'This run changes nothing.',
    )
  })
})

/** A conversion record by hand, as conversionRecords makes them. */
const conversion = (
  instanceId: string,
  part: 'typography' | 'fill',
  category: BindingRecord['category'],
  options: Partial<BindingRecord> = {},
): BindingRecord => ({
  id: conversionId(instanceId, part),
  nodeId: instanceId,
  nodeName: `“${instanceId}”`,
  nodeType: 'INSTANCE',
  entryId: 'frame',
  path: [],
  property:
    part === 'typography'
      ? { type: 'typography' }
      : { type: 'paint', field: 'fills', index: 0 },
  group: part === 'typography' ? 'typography' : 'colour',
  ...(part === 'fill' ? { kind: 'textFill' as const } : {}),
  category,
  outcome: category === 'sure' || category === 'check' ? category : 'none',
  oldKey: `convert:${part}:${instanceId}`,
  old:
    part === 'typography'
      ? 'typography/ui-body/md/font-size'
      : 'Text/Neutral/Strong',
  candidates: [part === 'typography' ? 'label/md/default' : 'text/primary'],
  rule: part === 'typography' ? 'type/style' : 'colour/text-neutral',
  ...options,
})

/**
 * Typography instances: `ready` with a Ready colour, `cased` in upper case
 * and a colour that needs a check, confirmed by a designer, `plain` and
 * `plain2` without a legacy colour in the main component Card, `check` and
 * `check2` not decided, `later` set to Decide later, and `missing` without
 * a record.
 */
const conversions: BindingRecord[] = [
  conversion('ready', 'typography', 'sure'),
  conversion('ready', 'fill', 'sure'),
  conversion('cased', 'typography', 'check', { textCase: 'UPPER' }),
  conversion('cased', 'fill', 'check'),
  conversion('plain', 'typography', 'sure'),
  conversion('plain2', 'typography', 'sure'),
  conversion('check', 'typography', 'check'),
  conversion('later', 'typography', 'sure'),
  conversion('check2', 'typography', 'check'),
]
const ids = [
  'ready',
  'cased',
  'plain',
  'plain2',
  'check',
  'later',
  'missing',
  'check2',
]
const choices: Overrides = {
  records: {
    'convert:cased|typography': 'label/md/default',
    'convert:later|typography': DECIDE_LATER,
  },
  rows: {},
}
const card = { id: 'card', name: 'Card' }
const typographyInstances: OldInstance[] = ids.map((id) =>
  instance(id, {
    typography: true,
    ...(id.startsWith('plain') ? { inComponent: card } : {}),
  }),
)

describe('previewConversions', () => {
  const plan = planConversions(conversions, choices, ids)

  it('counts the conversions, their colours, the dropped cases, the text carried across and the skips', () => {
    expect(previewConversions(plan, typographyInstances, { card: 12 })).toEqual(
      {
        converted: 4,
        coloursChanged: 1,
        coloursLegacy: 1,
        coloursCopied: 2,
        casesDropped: 1,
        inComponents: 2,
        carried: [{ id: 'card', name: 'Card', instances: 12 }],
        skipped: [
          {
            reason:
              'Its text style needs a check. Confirm the proposal or choose another style before converting.',
            count: 2,
          },
          {
            reason:
              'Its text style is set to Decide later, so Convert leaves it.',
            count: 1,
          },
          { reason: NO_LEGACY_TYPOGRAPHY, count: 1 },
        ],
      },
    )
  })

  it('counts what the plan converts, and each converted colour once', () => {
    const preview = previewConversions(plan, typographyInstances)
    expect(preview.converted).toBe(plan.convert.length)
    expect(
      preview.coloursChanged + preview.coloursLegacy + preview.coloursCopied,
    ).toBe(preview.converted)
    expect(preview.skipped.reduce((sum, item) => sum + item.count, 0)).toBe(
      plan.skipped.length,
    )
  })

  it('names the main component without a count until the instances are counted, and leaves one without instances out', () => {
    expect(previewConversions(plan, typographyInstances).carried).toEqual([
      { id: 'card', name: 'Card' },
    ])
    expect(
      previewConversions(plan, typographyInstances, { card: 0 }).carried,
    ).toEqual([])
  })

  it('counts a dropped case only where the style the conversion uses has another case', () => {
    const plain = planConversions(conversions, choices, ['ready', 'plain'])
    expect(previewConversions(plain, typographyInstances).casesDropped).toBe(0)
  })
})

describe('the Convert confirmation', () => {
  const plan = planConversions(conversions, choices, ids)

  it('lists what converting changes, the instances it leaves, and the change log', () => {
    const text = convertText(
      previewConversions(plan, typographyInstances, { card: 12 }),
    )
    expect(text.changes).toEqual({
      lead: 'Converting makes these changes:',
      items: [
        '4 Typography instances replaced by text layers with an EDS Beta text style',
        '1 text colour changed to an EDS Beta variable',
        '1 text colour left on its legacy variable, which Changes lists after converting',
        '2 text colours copied as they are, since they use no legacy variable',
        '1 text case dropped, which you confirmed: the text shows as typed',
        'The text of the 12 instances of Card is carried across to the new text layers',
      ],
    })
    expect(text.lists).toEqual([
      {
        lead: 'Convert leaves 4 instances as they are:',
        items: [
          'Its text style needs a check. Confirm the proposal or choose another style before converting. (2 instances)',
          'Its text style is set to Decide later, so Convert leaves it. (1 instance)',
          `${NO_LEGACY_TYPOGRAPHY} (1 instance)`,
        ],
      },
    ])
    expect(text.footnote).toBe(
      "Undo with Ctrl or Cmd+Z. The plugin notes each conversion in the new text layer's plugin data, so Revert frame or Revert main component can put the Typography instance back later.",
    )
  })

  it('names the Revert that puts the instances back, by where they are', () => {
    const inCard = planConversions(conversions, choices, ['plain'])
    expect(
      convertText(previewConversions(inCard, typographyInstances)).footnote,
    ).toContain('so Revert main component can put')
    const inFrame = planConversions(conversions, choices, ['ready'])
    expect(
      convertText(previewConversions(inFrame, typographyInstances)).footnote,
    ).toContain('so Revert frame can put')
  })

  it('says the text of each instance is carried across before the instances are counted', () => {
    const inCard = planConversions(conversions, choices, ['plain'])
    const text = convertText(previewConversions(inCard, typographyInstances))
    expect(text.changes).toMatchObject({
      items: expect.arrayContaining([
        'The text each instance of Card shows is carried across to the new text layer',
      ]) as unknown,
    })
  })

  it('is disabled while counting and when nothing converts', () => {
    expect(convertDisabled(undefined)).toBe(true)
    const nothing = previewConversions(
      planConversions(conversions, choices, ['check', 'later']),
      typographyInstances,
    )
    expect(nothing.converted).toBe(0)
    expect(convertDisabled(nothing)).toBe(true)
    expect(convertText(nothing).changes).toBe('Converting changes nothing.')
    expect(convertDisabled(previewConversions(plan, typographyInstances))).toBe(
      false,
    )
  })
})

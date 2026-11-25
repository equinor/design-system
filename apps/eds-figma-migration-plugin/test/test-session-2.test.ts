/**
 * Fixes from the second test session (2026-11-25) that can be tested
 * without Figma: the words of a run's result, the scan a result belongs to,
 * the singular for one value, the rows of Typography instances told apart,
 * and the reasons Convert gives for the instances it leaves.
 */
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import { legacyTypographyText } from '../src/mapping/rules'
import {
  conversionSkipReason,
  NO_LEGACY_TYPOGRAPHY,
} from '../src/scan/apply-plan'
import { classifyUnits } from '../src/scan/classify'
import { buildMappingGroups, DECIDE_LATER } from '../src/scan/mapping'
import type { RawUnit, RawVariable } from '../src/scan/types'
import { scanKey } from '../src/shared/pages'
import type { ApplyResult } from '../src/shared/messages'
import { legacyText, plural, rowLabels } from '../src/ui/labels'
import { runSummary } from '../src/ui/preview'
import { ROOT, spacingSemantic, textInput, ctx } from './helpers'

const applied = (result: Partial<ApplyResult>): ApplyResult => ({
  planned: 0,
  applied: 0,
  values: 0,
  numbers: 0,
  modes: 0,
  layers: 0,
  modesKept: 0,
  resets: 0,
  failedFixes: [],
  failed: [],
  ...result,
})

describe('the result of a run', () => {
  it('calls numbers set without a variable that, as the confirmation does, not border widths', () => {
    // Page 2 of the test file: 141 paddings and gaps set to 0
    expect(
      runSummary({
        kind: 'apply',
        result: applied({ numbers: 141, layers: 62 }),
      }),
    ).toBe('Set 141 numbers without a variable, on 62 layers.')
    expect(
      runSummary({
        kind: 'apply',
        result: applied({ values: 118, numbers: 1, layers: 62 }),
      }),
    ).toBe(
      'Migrated 118 values and set 1 number without a variable, on 62 layers.',
    )
  })
})

describe('the scan a result belongs to', () => {
  const page = { scope: 'page' as const, pageId: '0:1', nodeIds: ['1:2'] }

  it('is the same for the scan right after a run, on the same layers', () => {
    expect(scanKey(page)).toBe(scanKey({ ...page }))
    expect(
      scanKey({ scope: 'selection', pageId: '0:1', nodeIds: ['1:3', '1:2'] }),
    ).toBe(
      scanKey({ scope: 'selection', pageId: '0:1', nodeIds: ['1:2', '1:3'] }),
    )
  })

  it('differs for another page, another selection or another scope', () => {
    expect(scanKey(page)).not.toBe(scanKey({ ...page, pageId: '0:2' }))
    expect(scanKey({ ...page, scope: 'selection' })).not.toBe(
      scanKey({ ...page, scope: 'selection', nodeIds: ['1:9'] }),
    )
    expect(scanKey(page)).not.toBe(
      scanKey({ ...page, scope: 'file', pageIds: ['0:1'] }),
    )
  })
})

describe('one value in a row', () => {
  it('is named in the singular, with a verb that agrees', () => {
    expect(rowLabels('Text/Neutral/Strong', 1, 'instances')).toEqual({
      select: 'Select the 1 value that uses Text/Neutral/Strong',
      goTo: 'Go to the 1 instance that uses Text/Neutral/Strong',
      show: 'Show the instance that uses Text/Neutral/Strong',
      hide: 'Hide the instance that uses Text/Neutral/Strong',
    })
    expect(rowLabels('Text/Neutral/Strong', 3).goTo).toBe(
      'Go to the 3 layers that use Text/Neutral/Strong',
    )
    expect(plural(1, 'instance')).toBe('1 instance')
    expect(plural(4, 'instance')).toBe('4 instances')
  })
})

describe('rows of Typography instances', () => {
  // The legacy Typography component binds the same 🗣️ Semantic variables
  // in every instance; its modes and font decide the size and weight.
  const variable = (name: string, type = 'FLOAT'): RawVariable => ({
    id: `VariableID:${name}`,
    key: `key-${name}`,
    name,
    type: type as RawVariable['type'],
    collectionKey: OLD.spacingSemantic,
    collectionName: '🗣️ Semantic',
  })
  const fields = {
    fontFamily: variable('Typography/Font family', 'STRING'),
    fontSize: variable('Typography/Font size'),
    lineHeight: variable('Typography/Line height'),
  }
  const unit = (
    id: string,
    step: string,
    style: string,
    lineHeight = 'default',
  ): RawUnit => ({
    nodeId: id,
    nodeName: 'Typography',
    nodeType: 'TEXT',
    entryId: 'frame',
    path: ['Frame'],
    unit: 'typography',
    property: { type: 'typography' },
    fields,
    font: { family: 'Inter', style },
    fontSize: 14,
    context: {
      nodeType: 'TEXT',
      names: ['Typography', ROOT],
      singleLine: true,
      modes: {
        [OLD.fontSize]: step,
        [OLD.fontFamily]: 'UI body',
        [OLD.lineHeight]: lineHeight,
      },
    },
  })

  it('read the family, step, line height and font style from the modes', () => {
    expect(
      legacyTypographyText(
        textInput(
          {
            fontSize: spacingSemantic(
              'Typography/Font size',
              'typography/ui-body/sm/font-size',
            ),
            lineHeight: spacingSemantic(
              'Typography/Line height',
              'typography/ui-body/sm/line-height-squished',
            ),
          },
          'Inter Medium',
          ctx(['Chip label']),
        ),
      ),
    ).toBe('UI body, sm, Medium, squished')
    expect(
      legacyTypographyText({
        fields: {},
        font: { family: 'Roboto', style: 'Regular' },
        fontSize: 13,
        context: ctx(['Label']),
      }),
    ).toBe('13px, Roboto Regular')
  })

  it('are told apart by what the rules read, where the variable names are the same', () => {
    const records = classifyUnits([
      unit('1:1', 'MD', 'Regular'),
      unit('1:2', 'MD', 'Regular'),
      unit('1:3', 'LG', 'Medium', 'squished'),
    ])
    const [group] = buildMappingGroups(records)
    expect(group.rows).toHaveLength(2)
    const labels = group.rows.map((row) => legacyText(group, row))
    expect(labels).toEqual([
      'UI body, md, Regular, default',
      'UI body, lg, Medium, squished',
    ])
    // Without the row, the names alone say no more than the family.
    expect(legacyText(group)).toBe('UI body')
    expect(rowLabels(labels[1], 1, 'instances').goTo).toBe(
      'Go to the 1 instance that uses UI body, lg, Medium, squished',
    )
  })
})

describe('why Convert leaves an instance', () => {
  it('reads right for one instance and for several', () => {
    const reasons = [
      conversionSkipReason(undefined),
      conversionSkipReason({ category: 'check', target: 'body/md/default' }),
      conversionSkipReason({ category: 'none', target: 'body/md/default' }),
      conversionSkipReason({ category: 'sure', target: DECIDE_LATER }),
    ]
    expect(reasons[0]).toBe(NO_LEGACY_TYPOGRAPHY)
    for (const reason of reasons) {
      // The confirmation adds "(4 instances)" after the reason.
      expect(reason).not.toMatch(/\b(its|it|this text|the instance)\b/i)
    }
  })
})

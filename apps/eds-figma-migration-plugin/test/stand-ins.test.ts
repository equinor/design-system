/**
 * Stand-ins where the EDS Beta has no token (decision D, 2026-11-16): every
 * path that ended in No equivalent without a target now keeps the outcome
 * none, with a stand-in as the first candidate and a reason that names the
 * gap. The stand-in is applied only once a designer chooses it.
 */
import { describe, expect, it } from 'vitest'
import { OLD } from '../src/mapping/inventory'
import {
  resolveMode,
  resolveTypography,
  resolveVariable,
} from '../src/mapping/rules'
import type {
  BindingKind,
  OldVariable,
  Resolution,
  RoleContext,
} from '../src/mapping/types'
import { changeOutcome, planChanges } from '../src/scan/apply-plan'
import { CLEAR_MODE, classifyUnit, holdModes } from '../src/scan/classify'
import {
  buildMappingGroups,
  effectiveCategory,
  NO_OVERRIDES,
  targetCounts,
} from '../src/scan/mapping'
import { buildReport } from '../src/scan/report'
import { emptyCounts } from '../src/scan/summary'
import type { BindingRecord, RawUnit, ScanSummary } from '../src/scan/types'
import { reviewItems } from '../src/ui/review'
import { unchangedLabel } from '../src/ui/targets'
import { ctx, density, densityType, staticColour, textInput } from './helpers'

function resolve(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext = ctx(['Panel']),
): Resolution {
  return resolveVariable({ kind, variable, context })
}

const semantic = (name: string, value?: number): OldVariable => ({
  collectionKey: OLD.spacingSemantic,
  name,
  type: 'FLOAT',
  ...(value !== undefined ? { value } : {}),
})

const palette = (name: string, colour?: string): OldVariable => ({
  collectionKey: OLD.colorScheme,
  name,
  type: 'COLOR',
  ...(colour ? { colour } : {}),
})

describe('numbers by px', () => {
  it('a stroke width on a padding gets the spacing token with the same px (spacing/no-equivalent)', () => {
    const result = resolve('spacing', {
      ...density('sizing/stroke/thick'),
      value: 2,
    })
    expect(result).toMatchObject({
      outcome: 'none',
      candidates: ['spacing/4xs'],
      rule: 'number/same-px',
    })
    expect(result.reason).toMatch(/the EDS Beta has no stroke width token/)
    expect(result.reason).toMatch(/spacing\/4xs, which is 2px in comfortable/)
  })

  it('a stroke width with no spacing token of its px becomes the px without a variable', () => {
    const result = resolve('spacing', semantic('Generic/Stroke width', 1))
    expect(result).toMatchObject({
      outcome: 'none',
      candidates: ['value:1'],
      rule: 'number/as-px',
    })
    expect(result.reason).toBe(
      'Generic/Stroke width: the EDS Beta has no stroke width token; no EDS Beta spacing token is 1px in comfortable, so the stand-in is 1px without a variable',
    )
  })

  it('a 0 is 0 without a variable, since it needs no token', () => {
    expect(
      resolve('spacing', { ...density('sizing/stroke/none'), value: 0 }),
    ).toMatchObject({
      outcome: 'none',
      candidates: ['value:0'],
      rule: 'number/as-px',
    })
  })

  it('a number no rule recognises gets the spacing token with its px (spacing/unknown)', () => {
    expect(
      resolve('spacing', semantic('Page/Gap horizontal', 24)),
    ).toMatchObject({
      outcome: 'none',
      candidates: ['spacing/xl'],
      rule: 'number/same-px',
    })
    expect(resolve('size', semantic('Page/Gap horizontal', 18))).toMatchObject({
      outcome: 'none',
      candidates: ['value:18'],
      rule: 'number/as-px',
    })
  })

  it('reads the px in the density the layer will have', () => {
    const compact = ctx(['Panel'], { modes: { [OLD.density]: 'Comfortable' } })
    expect(
      resolve('spacing', semantic('Page/Gap horizontal', 12), compact),
    ).toMatchObject({ candidates: ['spacing/md'], rule: 'number/same-px' })
  })

  it('a radius gets the corner radius token with its px', () => {
    expect(
      resolve('radius', semantic('Generic/Corner radius', 4)),
    ).toMatchObject({
      outcome: 'none',
      candidates: ['corner-radius/rounded'],
      rule: 'number/same-px',
    })
    expect(
      resolve('radius', semantic('Generic/Corner radius', 12)),
    ).toMatchObject({ candidates: ['value:12'], rule: 'number/as-px' })
  })

  it('a typography variable on a size gets the spacing token with its px (spacing/typography-elsewhere)', () => {
    const result = resolve('size', {
      ...density('typography/ui-body/md/font-size'),
      value: 16,
    })
    expect(result).toMatchObject({
      outcome: 'none',
      candidates: ['spacing/md'],
      rule: 'number/same-px',
    })
    expect(result.reason).toMatch(/text styles replace typography variables/)
  })

  it('an inset with no step beyond it gets the spacing token with its px (spacing/inset-proportion)', () => {
    expect(
      resolve('spacing', {
        ...density('spacing/inset/9xl/vertical-stretched'),
        value: 128,
      }),
    ).toMatchObject({
      outcome: 'none',
      candidates: ['spacing/9xl'],
      rule: 'number/same-px',
    })
  })

  it('a number on an effect only gets a variable, since the plugin cannot set a number there', () => {
    expect(resolve('other', semantic('Page/Gap horizontal', 8))).toMatchObject({
      candidates: ['spacing/xs'],
      rule: 'number/same-px',
    })
    expect(resolve('other', semantic('Page/Gap horizontal', 18))).toMatchObject(
      { outcome: 'none', candidates: [], rule: 'spacing/unknown' },
    )
  })

  it('a number whose px could not be read has no stand-in', () => {
    expect(resolve('spacing', semantic('Page/Gap horizontal'))).toMatchObject({
      outcome: 'none',
      candidates: [],
      rule: 'spacing/unknown',
    })
    expect(resolve('size', density('sizing/icon/lg'))).toMatchObject({
      outcome: 'none',
      candidates: [],
      rule: 'size/icon',
    })
  })

  it('a selectable control size is sized like an icon, as the mapping rules say', () => {
    expect(
      resolve('size', { ...density('sizing/selectable/lg'), value: 20 }),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['spacing/lg'],
      rule: 'size/control',
    })
    expect(resolve('size', semantic('Selectable/Size', 18)).rule).toBe(
      'size/control',
    )
  })
})

describe('colours by role', () => {
  it('a palette colour on a fill gets the nearest background colour (colour/palette)', () => {
    const result = resolve('fill', palette('Grey/40', '#6f6f6f'))
    expect(result).toMatchObject({
      outcome: 'none',
      rule: 'colour/nearest-by-role',
    })
    expect(result.candidates[0]).toBe(
      'background/non-interactive/neutral/emphasis',
    )
    expect(result.candidates).toHaveLength(3)
    expect(result.reason).toMatch(/the EDS Beta has no palette colours/)
    expect(result.reason).toMatch(/nearest to the legacy #6f6f6f in light/)
  })

  it('takes the role from the property and the layer', () => {
    const grey = palette('Grey/40', '#6f6f6f')
    expect(resolve('textFill', grey, ctx(['Label'])).candidates[0]).toBe(
      'text/secondary',
    )
    expect(
      resolve('fill', grey, ctx(['Vector', 'Icon'], { nodeType: 'VECTOR' }))
        .candidates[0],
    ).toBe('icon/secondary')
    expect(resolve('stroke', grey).candidates[0]).toBe(
      'border/non-interactive/neutral/emphasis',
    )
  })

  it('gives an interactive layer interactive colours in its state, and a disabled one the disabled colour', () => {
    const hover = resolve(
      'fill',
      palette('Grey/40', '#6f6f6f'),
      ctx(['Button (hover)']),
    )
    expect(hover.candidates.length).toBeGreaterThan(0)
    for (const name of hover.candidates) {
      expect(name).toMatch(/^background\/interactive\/.+\/hover$/)
    }
    expect(
      resolve('fill', palette('Grey/40', '#6f6f6f'), ctx(['Button / Disabled']))
        .candidates,
    ).toEqual(['background/interactive/disabled'])
  })

  it('measures in the colour scheme the layer will have', () => {
    const dark = ctx(['Panel'], { modes: { [OLD.colorScheme]: 'Dark' } })
    const result = resolve('fill', palette('Shadow', '#00000029'), dark)
    expect(result.reason).toMatch(/in dark$/)
  })

  it('a colour on an effect takes the fill role of its layer, with overlay/scrim offered (colour/effect)', () => {
    const shadow = staticColour('Bg/Neutral/Surface')
    const result = resolve('effect', { ...shadow, colour: '#ffffff' })
    expect(result).toMatchObject({
      outcome: 'none',
      rule: 'colour/nearest-by-role',
    })
    expect(result.candidates[0]).toMatch(/^background\//)
    expect(result.candidates).toContain('overlay/scrim')
    expect(result.reason).toMatch(
      /the EDS Beta has no colour token for effects/i,
    )
  })

  it('a colour on an effect that could not be read gets overlay/scrim', () => {
    const result = resolve('effect', staticColour('Bg/Neutral/Surface'))
    expect(result).toMatchObject({
      outcome: 'none',
      candidates: ['overlay/scrim'],
      rule: 'colour/nearest-by-role',
    })
  })

  it('a colour name no rule recognises gets the nearest colour for its family (colour/unknown)', () => {
    const result = resolve('fill', {
      ...staticColour('Bg/Neutral/Weird'),
      colour: '#ffe0e0',
    })
    expect(result).toMatchObject({
      outcome: 'none',
      rule: 'colour/nearest-by-role',
    })
    expect(result.candidates[0]).toBe('background/non-interactive/danger/muted')
    expect(result.reason).toMatch(
      /^No rule for Bg\/Weird: the plugin knows no EDS Beta token for it; the stand-in is/,
    )
  })

  it('a colour that could not be read gets the usual colour for the role', () => {
    expect(
      resolve('textFill', staticColour('Text/Neutral/Weird'), ctx(['Label']))
        .candidates,
    ).toEqual(['text/primary'])
    expect(resolve('fill', palette('Grey/40')).candidates).toEqual([
      'background/surface',
    ])
  })

  it('leaves out tertiary text, which falls below the contrast minimum', () => {
    const result = resolve(
      'textFill',
      palette('Grey/30', '#a4a4a4'),
      ctx(['Label']),
    )
    expect(result.candidates).not.toContain('text/tertiary')
  })
})

describe('type sizes', () => {
  const fields = densityType({
    family: 'ui-body',
    step: '9xl',
    lineHeight: 'default',
  })

  it('a step the role does not have gets the step nearest to the font size (type/no-step)', () => {
    const result = resolveTypography({
      ...textInput(fields, 'Inter Regular', ctx(['Text'])),
      fontSize: 80,
    })
    expect(result).toMatchObject({
      outcome: 'none',
      rule: 'type/nearest-step',
    })
    expect(result.candidates[0]).toBe('body/3xl/default')
    expect(result.reason).toMatch(/^The EDS Beta has no body step near 9xl/)
  })

  it('without a size it gets the md step of the role', () => {
    expect(
      resolveTypography(textInput(fields, 'Inter Regular', ctx(['Text'])))
        .candidates[0],
    ).toBe('body/md/default')
    expect(
      resolveTypography({
        fields: {},
        font: { family: 'Equinor', style: 'Medium' },
        context: ctx(['Title'], { nodeType: 'TEXT' }),
      }),
    ).toMatchObject({
      outcome: 'none',
      candidates: ['header/md'],
      rule: 'type/nearest-step',
    })
  })
})

describe('modes', () => {
  it('an unknown legacy mode gets removing it as its stand-in (mode/unknown)', () => {
    const resolution = resolveMode({
      collectionKey: OLD.colorScheme,
      modeName: 'High contrast',
    })
    expect(resolution).toMatchObject({ outcome: 'none', rule: 'mode/unknown' })
    expect(resolution.reason).toMatch(/the EDS Beta has no mode that matches/)

    const unit: RawUnit = {
      nodeId: '1:2',
      nodeName: 'Card',
      nodeType: 'FRAME',
      entryId: '1:1',
      path: [],
      unit: 'mode',
      property: {
        type: 'mode',
        collectionId: `VariableCollectionId:${OLD.colorScheme}/1:1`,
      },
      collectionId: `VariableCollectionId:${OLD.colorScheme}/1:1`,
      collectionKey: OLD.colorScheme,
      collectionName: '🌗 Color scheme',
      modeId: '1:3',
      modeName: 'High contrast',
      context: ctx(['Card']),
    }
    expect(classifyUnit(unit)).toMatchObject({
      category: 'none',
      candidates: [CLEAR_MODE],
      rule: 'mode/unknown',
    })
  })
})

describe('no stand-in', () => {
  it('a string variable has none', () => {
    expect(
      resolve('other', density('typography/ui-body/font-family', 'STRING')),
    ).toMatchObject({ outcome: 'none', candidates: [], rule: 'other/type' })
  })
})

describe('the scan passes the legacy colour to the rules', () => {
  it('so a palette colour gets the colour nearest to it', () => {
    const record = classifyUnit({
      nodeId: '1:2',
      nodeName: 'Panel',
      nodeType: 'FRAME',
      entryId: '1:1',
      path: [],
      unit: 'variable',
      kind: 'fill',
      property: { type: 'paint', field: 'fills', index: 0 },
      variable: {
        id: 'VariableID:grey',
        key: 'grey',
        name: 'Grey/40',
        type: 'COLOR',
        collectionKey: OLD.colorScheme,
        collectionName: '🌗 Color scheme',
        colour: '#6f6f6f',
      },
      context: ctx(['Panel']),
    })
    expect(record).toMatchObject({
      category: 'none',
      rule: 'colour/nearest-by-role',
    })
    expect(record?.candidates?.[0]).toBe(
      'background/non-interactive/neutral/emphasis',
    )
  })

  it('and a stand-in under a text does not decide the text colour', () => {
    // A toned text on a palette fill: the fill's stand-in waits for a
    // designer, so the text needs a check as when no fill is found.
    const text = ctx(['Warning text', 'Notes'], {
      nodeType: 'TEXT',
      singleLine: true,
      fillUnder: {
        oldVariable: palette('Amber/10', '#fff5e7'),
        context: ctx(['Notes']),
      },
    })
    expect(
      resolve('textFill', staticColour('Text/Warning/Strong'), text).outcome,
    ).toBe('check')
  })
})

// ---------------------------------------------------------------------------
// What happens to a stand-in in the window and in Apply

const standIn = (
  id: string,
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
  category: 'none',
  outcome: 'none',
  oldKey: `${OLD.spacingSemantic}/Generic/Stroke width`,
  old: 'Generic/Stroke width',
  candidates: ['value:1'],
  reason:
    'Generic/Stroke width: the EDS Beta has no stroke width token; no EDS Beta spacing token is 1px in comfortable, so the stand-in is 1px without a variable',
  rule: 'number/as-px',
  ...options,
})

const heldMode = (): BindingRecord => ({
  id: `root|mode:${OLD.appearance}`,
  nodeId: 'root',
  nodeName: 'root',
  nodeType: 'FRAME',
  entryId: 'frame',
  path: [],
  property: {
    type: 'mode',
    collectionId: `VariableCollectionId:${OLD.appearance}/1`,
  },
  group: 'modes',
  category: 'none',
  outcome: 'none',
  oldKey: `mode:${OLD.appearance}:Danger`,
  old: 'Danger',
  oldCollection: '🎨 Appearance',
  candidates: [CLEAR_MODE],
  reason: 'The legacy mode stays',
  rule: 'mode/kept',
  oldMode: {
    collectionId: `VariableCollectionId:${OLD.appearance}/1`,
    collectionKey: OLD.appearance,
    modeId: '1:0',
    modeName: 'Danger',
  },
})

const noStandIn = standIn('string', {
  oldKey: `${OLD.density}/typography/ui-body/font-family`,
  old: 'typography/ui-body/font-family',
  candidates: [],
  rule: 'other/type',
})

describe('a stand-in in Apply', () => {
  const records = [standIn('stroke')]
  const frame = new Set(['frame'])

  it('stays No equivalent and is not planned until a designer chooses it', () => {
    expect(effectiveCategory(records[0], NO_OVERRIDES)).toBe('none')
    expect(planChanges(records, NO_OVERRIDES, frame)).toEqual([])
  })

  it('is planned once a designer chooses the stand-in, as confirmed, with its rule', () => {
    const chosen = { records: { stroke: 'value:1' }, rows: {} }
    const plan = planChanges(records, chosen, frame)
    expect(plan).toHaveLength(1)
    expect(plan[0]).toMatchObject({ target: 'value:1', outcome: 'confirmed' })
    expect(plan[0].record.rule).toBe('number/as-px')
    expect(changeOutcome(records[0], 'spacing/xs')).toBe('override')
  })

  it('is planned when the choice is made on its row', () => {
    const [group] = buildMappingGroups(records)
    const overrides = { records: {}, rows: { [group.rows[0].key]: 'value:1' } }
    expect(planChanges(records, overrides, frame)).toHaveLength(1)
  })
})

describe('a stand-in in Review', () => {
  it('is reviewed, while a value without a stand-in and a held legacy mode are not', () => {
    const groups = buildMappingGroups([
      standIn('stroke'),
      noStandIn,
      heldMode(),
    ])
    expect(
      reviewItems(groups, NO_OVERRIDES).map((item) => item.binding.id),
    ).toEqual(['stroke'])
  })

  it('leaves Review once a designer has chosen', () => {
    const groups = buildMappingGroups([standIn('stroke')])
    const chosen = { records: { stroke: 'value:1' }, rows: {} }
    expect(reviewItems(groups, chosen)).toEqual([])
  })
})

describe('a stand-in in the window', () => {
  it('is shown as the stand-in while its status stays No equivalent', () => {
    const [group] = buildMappingGroups([standIn('stroke')])
    const [count] = targetCounts(group.rows, NO_OVERRIDES)
    expect(count).toMatchObject({ target: 'value:1', noEquivalent: true })
    expect(unchangedLabel(count.rule, count.target)).toBe(
      'Stand-in: 1px, without a variable',
    )
    expect(unchangedLabel('mode/unknown', CLEAR_MODE)).toBe(
      'Stand-in: Remove the legacy mode',
    )
  })

  it('keeps the wording of a held legacy mode and of a value without a stand-in', () => {
    expect(unchangedLabel('mode/kept', CLEAR_MODE)).toBe(
      'Kept: legacy values below read it',
    )
    expect(unchangedLabel('mode/after-review', CLEAR_MODE)).toBe(
      'Kept until the values below are reviewed',
    )
    expect(unchangedLabel('other/type', null)).toBe(
      'No equivalent and no stand-in',
    )
  })
})

describe('a legacy mode above a stand-in', () => {
  const mode = (): BindingRecord => ({
    ...heldMode(),
    category: 'sure',
    outcome: 'sure',
    rule: 'mode/clear',
    oldKey: `mode:${OLD.spacingSemantic}:x`,
    oldMode: {
      collectionId: `VariableCollectionId:${OLD.spacingSemantic}/1`,
      collectionKey: OLD.spacingSemantic,
      modeId: '1:0',
      modeName: 'x',
    },
  })

  it('waits for the stand-in to be decided, as for a Needs check', () => {
    const [held] = holdModes([
      mode(),
      standIn('stroke', { modeHolders: ['root'] }),
    ])
    expect(held).toMatchObject({ category: 'none', rule: 'mode/after-review' })
  })

  it('stays for good above a value without a stand-in', () => {
    const [held] = holdModes([mode(), { ...noStandIn, modeHolders: ['root'] }])
    expect(held).toMatchObject({ category: 'none', rule: 'mode/kept' })
  })
})

describe('the report', () => {
  const records = [standIn('stroke'), noStandIn, heldMode()]
  const totals = { ...emptyCounts(), none: 3 }
  const summary: ScanSummary = {
    scope: 'page',
    scannedAt: '2026-11-16T12:00:00.000Z',
    mappingVersion: 'test',
    pages: [{ id: 'page', name: 'Page' }],
    nodesScanned: 3,
    totals,
    health: 0,
    entries: [
      {
        id: 'frame',
        kind: 'frame',
        name: 'Frame',
        pageId: 'page',
        pageName: 'Page',
        sections: [],
        nodeIds: ['frame'],
        counts: totals,
        health: 0,
        oldInstances: 0,
      },
    ],
  }
  const report = buildReport({
    fileName: 'Test',
    summary,
    records,
    oldInstances: [],
    overrides: NO_OVERRIDES,
  })

  it('lists No equivalent as gaps in the tokens, each with its stand-in', () => {
    expect(report.markdown).toContain('## No equivalent (3)')
    expect(report.markdown).toContain('| Stand-in | The gap |')
    expect(report.markdown).toMatch(
      /\| Generic\/Stroke width \| 1px, without a variable \| Generic\/Stroke width: the EDS Beta has no stroke width token/,
    )
    expect(report.markdown).toMatch(
      /typography\/ui-body\/font-family \| None possible \|/,
    )
  })

  it('lists the legacy modes that wait apart from the gaps', () => {
    expect(report.markdown).toContain('### Legacy modes waiting (1)')
    expect(report.markdown).toContain('🎨 Appearance: Danger')
  })

  it('writes a stand-in nobody has chosen as such in the CSV', () => {
    const row = report.csv.split('\n').find((line) => line.includes('stroke'))
    expect(row).toContain('Stand-in: 1px')
  })
})

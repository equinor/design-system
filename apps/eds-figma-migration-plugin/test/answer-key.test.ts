/**
 * The answer key for the test frame "Migration test – old EDS variables" in
 * the AI-Testing file (node 2300:3213), one test per row. The key lives in
 * design-system-internal: team-assistant/me/work/figma-var-migration/test-scenario.md.
 *
 * The contexts copy the frame's layer names, strokes and modes as they were
 * on 2026-11-11. Where the key was corrected after it was written, the test
 * says “(corrected)” and gives the reason.
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
import {
  appearance,
  appearanceMode,
  concept,
  ctx,
  density,
  densityType,
  spacingSemantic,
  staticColour,
  textInput,
} from './helpers'

function resolve(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): Resolution {
  return resolveVariable({ kind, variable, context })
}

function proposal(
  kind: BindingKind,
  variable: OldVariable,
  context: RoleContext,
): string | undefined {
  return resolve(kind, variable, context).candidates[0]
}

const ALL_SIDES: [number, number, number, number] = [1, 1, 1, 1]
const BOTTOM_ONLY: [number, number, number, number] = [0, 0, 1, 0]

// Layers in the frame, nearest name first
const topBar = ctx(['Top bar'], { strokeSides: ALL_SIDES })
const banner = ctx(['Banner / Info'])
const cardWell = ctx(['Card / Well', 'Card row'], { strokeSides: ALL_SIDES })
const chipStatusModes = {
  [OLD.borderRadius]: 'Pill',
  [OLD.selectableSpace]: 'XS',
  [OLD.fontSize]: 'SM',
  [OLD.lineHeight]: 'Squished',
  [OLD.fontFamily]: 'UI Body',
}
const chipStatus = ctx(['Chip / Status', 'Card / Well', 'Card row'], {
  modes: chipStatusModes,
})
const cardForm = ctx(['Card / Form', 'Card row'], { strokeSides: ALL_SIDES })
const textField = [
  'Text field (focused, error)',
  'Card / Form',
  'Card row',
] as const
const chipWarning = ctx(
  ['Chip / Warning (dynamic)', 'Card / Form', 'Card row'],
  {
    strokeSides: ALL_SIDES,
    modes: appearanceMode('Warning'),
  },
)
const cardActions = ctx(['Card / Actions'], { strokeSides: ALL_SIDES })
const button = (name: string, extra: Partial<RoleContext> = {}) =>
  ctx([name, 'Buttons', 'Card / Actions'], extra)
const table = ctx(['Table / Wells (dense)', 'Bottom row'], {
  strokeSides: ALL_SIDES,
})
const row = (name: string) =>
  ctx([name, 'Table / Wells (dense)', 'Bottom row'], {
    strokeSides: BOTTOM_ONLY,
  })
const overlay = ctx(['Overlay (dark scheme)', 'Bottom row'])
const menu = ctx(['Menu', 'Overlay (dark scheme)', 'Bottom row'], {
  strokeSides: ALL_SIDES,
})
const menuItem = (name: string) =>
  ctx([name, 'Menu', 'Overlay (dark scheme)', 'Bottom row'])

/** The fill under a text: the layer that owns it, its old variable and its context. */
const on = (variable: OldVariable, context: RoleContext) => ({
  oldVariable: variable,
  context,
})
const surface = staticColour('Bg/Neutral/Surface')

/** A text layer inside `parent`, which is nearest first. */
const text = (
  name: string,
  parent: RoleContext,
  extra: Partial<RoleContext> = {},
): RoleContext => ({
  ...parent,
  nodeType: 'TEXT',
  names: [name, ...parent.names],
  strokeSides: undefined,
  singleLine: true,
  ...extra,
})

describe('answer key: Migration test – old EDS variables', () => {
  it('row 1: root modes 🌗 Light and 💎 Spacious become light and comfortable', () => {
    expect(
      resolveMode({ collectionKey: OLD.colorScheme, modeName: 'Light' }),
    ).toMatchObject({
      outcome: 'sure',
      target: { collection: 'color-scheme', mode: 'light' },
    })
    expect(
      resolveMode({ collectionKey: OLD.density, modeName: 'Spacious' }),
    ).toMatchObject({
      outcome: 'sure',
      target: { collection: 'density', mode: 'comfortable' },
    })
  })

  it('row 2: root fill Bg/Neutral/Canvas', () => {
    const resolution = resolve(
      'fill',
      staticColour('Bg/Neutral/Canvas'),
      ctx([]),
    )
    expect(resolution).toMatchObject({
      outcome: 'sure',
      candidates: ['background/canvas'],
    })
  })

  it('row 3: root padding and gap', () => {
    expect(proposal('spacing', density('spacing/horizontal/xl'), ctx([]))).toBe(
      'spacing/xl',
    )
    expect(proposal('spacing', density('spacing/vertical/xl'), ctx([]))).toBe(
      'spacing/xl',
    )
    expect(proposal('spacing', density('spacing/vertical/lg'), ctx([]))).toBe(
      'spacing/lg',
    )
  })

  it('row 4: top bar fill and stroke', () => {
    expect(proposal('fill', surface, topBar)).toBe('background/surface')
    const stroke = resolve(
      'stroke',
      staticColour('Border/Neutral/Subtle'),
      topBar,
    )
    expect(stroke).toMatchObject({
      outcome: 'sure',
      candidates: ['border/non-interactive/neutral/muted'],
    })
  })

  it('row 5: top bar container padding', () => {
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Container/Space horizontal',
          'spacing/inset/md/horizontal',
        ),
        topBar,
      ),
    ).toBe('spacing/md')
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Container/Space vertical',
          'spacing/inset/md/vertical-squared',
        ),
        topBar,
      ),
    ).toBe('spacing/md')
  })

  it('row 6: radius spacing/border-radius/rounded', () => {
    expect(
      proposal('radius', density('spacing/border-radius/rounded'), topBar),
    ).toBe('corner-radius/rounded')
  })

  it('row 7: title group gap', () => {
    expect(
      proposal(
        'spacing',
        density('spacing/horizontal/sm'),
        ctx(['Title group', 'Top bar']),
      ),
    ).toBe('spacing/sm')
  })

  it('row 8: a text colour on the menu icon vector becomes icon/primary', () => {
    const vector = ctx(['Vector', 'Icon / menu', 'Title group', 'Top bar'], {
      nodeType: 'VECTOR',
    })
    expect(
      resolve('fill', staticColour('Text/Neutral/Strong'), vector),
    ).toMatchObject({ outcome: 'sure', candidates: ['icon/primary'] })
  })

  it('row 9: icon size sizing/icon/lg (24px) is proposed as spacing/xl, the same px', () => {
    const icon = ctx(['Icon / menu', 'Title group', 'Top bar'])
    expect(
      resolve('size', { ...density('sizing/icon/lg'), value: 24 }, icon),
    ).toMatchObject({ outcome: 'check', candidates: ['spacing/xl'] })
  })

  it('row 10: page title takes header/lg and text/primary', () => {
    const title = text('Page title', ctx(['Title group', 'Top bar']))
    const style = resolveTypography(
      textInput(
        densityType({
          family: 'header',
          step: 'lg',
          lineHeight: 'squished',
          weight: 'bolder',
          tracking: true,
        }),
        'Equinor Medium',
        title,
      ),
    )
    expect(style).toMatchObject({ outcome: 'sure', candidates: ['header/lg'] })
    expect(
      proposal('textFill', staticColour('Text/Neutral/Strong'), title),
    ).toBe('text/primary')
  })

  it('row 11: link “Help” takes label/md/default and the link colour', () => {
    const link = text('Link', topBar)
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'md',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          link,
        ),
      ).candidates[0],
    ).toBe('label/md/default')
    expect(resolve('textFill', concept('Text/Link'), link)).toMatchObject({
      outcome: 'sure',
      candidates: ['text/interactive/link/default'],
    })
  })

  it('row 12: banner fill is non-interactive, not interactive', () => {
    expect(
      proposal('fill', staticColour('Bg/Info/Fill Muted/Default'), banner),
    ).toBe('background/non-interactive/info/muted')
  })

  it('row 13: banner squished inset moves the vertical padding one step down', () => {
    expect(
      proposal('spacing', density('spacing/inset/md/horizontal'), banner),
    ).toBe('spacing/md')
    expect(
      proposal(
        'spacing',
        density('spacing/inset/md/vertical-squished'),
        banner,
      ),
    ).toBe('spacing/sm')
  })

  it('row 14: banner message takes body/md/default and the text for a muted fill', () => {
    const message = text('Message', banner, {
      singleLine: false,
      fillUnder: on(staticColour('Bg/Info/Fill Muted/Default'), banner),
    })
    expect(
      resolveTypography(
        textInput(
          densityType({ family: 'ui-body', step: 'md', lineHeight: 'default' }),
          'Inter Regular',
          message,
        ),
      ).candidates[0],
    ).toBe('body/md/default')
    expect(
      proposal('textFill', staticColour('Text/Info/Strong'), message),
    ).toBe('text/on-muted/info')
  })

  it('row 15: card row gap', () => {
    expect(
      proposal('spacing', density('spacing/horizontal/lg'), ctx(['Card row'])),
    ).toBe('spacing/lg')
  })

  it('row 16: card fill and Medium stroke', () => {
    expect(proposal('fill', surface, cardWell)).toBe('background/surface')
    expect(
      proposal('stroke', staticColour('Border/Neutral/Medium'), cardWell),
    ).toBe('border/non-interactive/neutral/default')
  })

  it('row 17: card container padding and gap', () => {
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Container/Space vertical',
          'spacing/inset/md/vertical-squared',
        ),
        cardWell,
      ),
    ).toBe('spacing/md')
    // Without a readable alias chain, the gap is read from the old modes.
    expect(
      proposal('spacing', spacingSemantic('Container/Gap vertical'), cardWell),
    ).toBe('spacing/md')
  })

  it('row 18: card titles take header/sm', () => {
    const title = text('Card title', cardWell)
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'header',
            step: 'sm',
            lineHeight: 'squished',
            weight: 'bolder',
          }),
          'Equinor Medium',
          title,
        ),
      ).candidates[0],
    ).toBe('header/sm')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Strong'), title),
    ).toBe('text/primary')
  })

  it('row 19: description takes body/md/default and text/secondary', () => {
    const description = text('Description', cardWell, { singleLine: false })
    expect(
      resolveTypography(
        textInput(
          densityType({ family: 'ui-body', step: 'md', lineHeight: 'default' }),
          'Inter Regular',
          description,
        ),
      ).candidates[0],
    ).toBe('body/md/default')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Subtle'), description),
    ).toBe('text/secondary')
  })

  it('row 20: the five Chip / Status modes are cleared and nothing new is set', () => {
    for (const [collectionKey, modeName] of Object.entries(chipStatusModes)) {
      expect(resolveMode({ collectionKey, modeName })).toMatchObject({
        outcome: 'sure',
        target: null,
      })
    }
  })

  it('row 21: status chip fill is non-interactive, as a check item', () => {
    const fill = resolve(
      'fill',
      staticColour('Bg/Success/Fill Muted/Default'),
      chipStatus,
    )
    expect(fill.outcome).toBe('check')
    expect(fill.candidates[0]).toBe('background/non-interactive/success/muted')
  })

  it('row 22: status chip padding from the Selectable space mode XS', () => {
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Selectable/Space horizontal',
          'spacing/inset/xs/horizontal',
        ),
        chipStatus,
      ),
    ).toBe('spacing/xs')
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Selectable/Space vertical',
          'spacing/inset/xs/vertical-squared',
        ),
        chipStatus,
      ),
    ).toBe('spacing/xs')
  })

  it('row 23: status chip radius from the Border radius mode Pill', () => {
    expect(
      proposal(
        'radius',
        spacingSemantic('Generic/Corner radius', 'spacing/border-radius/pill'),
        chipStatus,
      ),
    ).toBe('corner-radius/pill')
  })

  it('row 24: status chip label from the 🗣️ Semantic typography variables', () => {
    const label = text('Chip label', chipStatus, {
      fillUnder: on(staticColour('Bg/Success/Fill Muted/Default'), chipStatus),
    })
    const style = resolveTypography(
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
          fontFamily: spacingSemantic(
            'Typography/Font family',
            'typography/ui-body/font-family',
            'STRING',
          ),
        },
        'Inter Regular',
        label,
      ),
    )
    expect(style).toMatchObject({
      outcome: 'sure',
      candidates: ['label/sm/default'],
    })
    expect(
      proposal('textFill', staticColour('Text/Success/Strong'), label),
    ).toBe('text/on-muted/success')
  })

  it('row 25: form card fill, stroke and padding', () => {
    expect(proposal('fill', surface, cardForm)).toBe('background/surface')
    expect(
      proposal('stroke', staticColour('Border/Neutral/Subtle'), cardForm),
    ).toBe('border/non-interactive/neutral/muted')
    expect(
      proposal(
        'spacing',
        spacingSemantic(
          'Container/Space horizontal',
          'spacing/inset/md/horizontal',
        ),
        cardForm,
      ),
    ).toBe('spacing/md')
  })

  it('row 26: text field gap', () => {
    expect(
      proposal('spacing', density('spacing/vertical/xs'), ctx([...textField])),
    ).toBe('spacing/xs')
  })

  it('row 27: field label', () => {
    const label = text('Field label', ctx([...textField]))
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'sm',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          label,
        ),
      ).candidates[0],
    ).toBe('label/sm/default')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Subtle'), label),
    ).toBe('text/secondary')
  })

  it('row 28: input fill and focus stroke', () => {
    const input = ctx(['Input', ...textField], { strokeSides: [2, 2, 2, 2] })
    expect(resolve('fill', concept('Bg/Input'), input)).toMatchObject({
      outcome: 'sure',
      candidates: ['background/input'],
    })
    expect(resolve('stroke', concept('Border/Focus'), input)).toMatchObject({
      outcome: 'sure',
      candidates: ['border/interactive/focus'],
    })
  })

  it('row 29: input padding', () => {
    const input = ctx(['Input', ...textField])
    expect(proposal('spacing', density('spacing/horizontal/sm'), input)).toBe(
      'spacing/sm',
    )
    expect(proposal('spacing', density('spacing/vertical/xs'), input)).toBe(
      'spacing/xs',
    )
  })

  it('row 30: input value', () => {
    const value = text('Value', ctx(['Input', ...textField]))
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'md',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          value,
        ),
      ).candidates[0],
    ).toBe('label/md/default')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Strong'), value),
    ).toBe('text/primary')
  })

  it('row 31: error helper text on the card surface takes on-default, as a check item', () => {
    const helper = text('Helper text (error)', ctx([...textField]), {
      singleLine: false,
      fillUnder: on(surface, cardForm),
    })
    expect(
      resolveTypography(
        textInput(
          densityType({ family: 'ui-body', step: 'sm', lineHeight: 'default' }),
          'Inter Regular',
          helper,
        ),
      ).candidates[0],
    ).toBe('body/sm/default')
    const colour = resolve(
      'textFill',
      staticColour('Text/Danger/Strong'),
      helper,
    )
    expect(colour.outcome).toBe('check')
    expect(colour.candidates[0]).toBe('text/on-default/danger')
  })

  it('row 32: the Appearance mode on Chip / Warning is cleared', () => {
    expect(
      resolveMode({ collectionKey: OLD.appearance, modeName: 'Warning' }),
    ).toMatchObject({ outcome: 'sure', target: null })
  })

  // Corrected from the key, which expects non-interactive fills here. A chip
  // is interactive; Badge is its non-interactive counterpart (decided
  // 2026-11-11). The values are the ones the Beta Chip uses for a tone.
  it('row 33 (corrected): warning chip fill and stroke are interactive, as in the Beta Chip', () => {
    const fill = resolve(
      'fill',
      appearance('Bg/Fill/Muted/Default'),
      chipWarning,
    )
    expect(fill.outcome).toBe('check')
    expect(fill.candidates[0]).toBe(
      'background/interactive/warning/muted/default',
    )
    const stroke = resolve('stroke', appearance('Border/Subtle'), chipWarning)
    expect(stroke.outcome).toBe('check')
    expect(stroke.candidates[0]).toBe(
      'border/interactive/warning/muted/default',
    )
  })

  it('row 34: warning chip padding', () => {
    expect(
      proposal('spacing', density('spacing/horizontal/xs'), chipWarning),
    ).toBe('spacing/xs')
    expect(
      proposal('spacing', density('spacing/vertical/xs'), chipWarning),
    ).toBe('spacing/xs')
  })

  it('row 35: warning chip label takes the tone from the Appearance mode', () => {
    const label = text('Chip label', chipWarning, {
      fillUnder: on(appearance('Bg/Fill/Muted/Default'), chipWarning),
    })
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'sm',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          label,
        ),
      ).candidates[0],
    ).toBe('label/sm/default')
    expect(proposal('textFill', appearance('Text/Strong'), label)).toBe(
      'text/on-muted/warning',
    )
  })

  it('row 36: actions card as the form card', () => {
    expect(proposal('fill', surface, cardActions)).toBe('background/surface')
    expect(
      proposal('stroke', staticColour('Border/Neutral/Subtle'), cardActions),
    ).toBe('border/non-interactive/neutral/muted')
  })

  it('row 37: buttons gap and wrap gap', () => {
    const buttons = ctx(['Buttons', 'Card / Actions'])
    expect(proposal('spacing', density('spacing/horizontal/sm'), buttons)).toBe(
      'spacing/sm',
    )
    expect(proposal('spacing', density('spacing/vertical/sm'), buttons)).toBe(
      'spacing/sm',
    )
  })

  it('row 38: every button padding and gap', () => {
    const primary = button('Button / Primary')
    expect(proposal('spacing', density('spacing/horizontal/md'), primary)).toBe(
      'spacing/md',
    )
    expect(proposal('spacing', density('spacing/vertical/xs'), primary)).toBe(
      'spacing/xs',
    )
    expect(proposal('spacing', density('spacing/horizontal/xs'), primary)).toBe(
      'spacing/xs',
    )
  })

  it('row 39: every button label takes label/md/medium', () => {
    const label = text('Label', button('Button / Primary'))
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'md',
            lineHeight: 'squished',
            weight: 'bolder',
          }),
          'Inter Medium',
          label,
        ),
      ),
    ).toMatchObject({ outcome: 'sure', candidates: ['label/md/medium'] })
  })

  it('row 40: primary button fill and label', () => {
    const primary = button('Button / Primary')
    expect(
      proposal(
        'fill',
        staticColour('Bg/Accent/Fill Emphasis/Default'),
        primary,
      ),
    ).toBe('background/interactive/accent/emphasis/default')
    expect(
      resolve(
        'textFill',
        staticColour('Text/Accent/Strong on emphasis'),
        text('Label', primary),
      ),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['text/on-emphasis/accent'],
    })
  })

  it('row 41: primary button hover fill', () => {
    expect(
      resolve(
        'fill',
        staticColour('Bg/Accent/Fill Emphasis/Hover'),
        button('Button / Primary (hover)'),
      ),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['background/interactive/accent/emphasis/hover'],
    })
  })

  it('row 42: shortcut hint maps Subtle on emphasis with a note, and takes label/md/default', () => {
    const hint = text('Shortcut hint', button('Button / Primary (hover)'))
    const colour = resolve(
      'textFill',
      staticColour('Text/Accent/Subtle on emphasis'),
      hint,
    )
    expect(colour.outcome).toBe('check')
    expect(colour.candidates[0]).toBe('text/on-emphasis/accent')
    expect(colour.reason).toMatch(/no equivalent/)
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'md',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          hint,
        ),
      ).candidates[0],
    ).toBe('label/md/default')
  })

  it('row 43: outlined button stroke and label', () => {
    const outlined = button('Button / Outlined', { strokeSides: ALL_SIDES })
    expect(
      proposal('stroke', staticColour('Border/Accent/Medium'), outlined),
    ).toBe('border/interactive/accent/emphasis/default')
    const label = text('Label', outlined, {
      fillUnder: on(surface, cardActions),
    })
    expect(
      proposal('textFill', staticColour('Text/Accent/Strong'), label),
    ).toBe('text/on-default/accent')
  })

  it('row 44: ghost button hover fill and label', () => {
    const ghost = button('Button / Ghost (hover)')
    expect(
      resolve('fill', staticColour('Bg/Accent/Fill Muted/Hover'), ghost),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['background/interactive/accent/muted/hover'],
    })
    const label = text('Label', ghost, {
      fillUnder: on(staticColour('Bg/Accent/Fill Muted/Hover'), ghost),
    })
    expect(
      proposal('textFill', staticColour('Text/Accent/Strong'), label),
    ).toBe('text/on-default/accent')
  })

  it('row 45: danger button takes the tone from the Appearance mode, which is cleared', () => {
    const danger = button('Button / Danger (dynamic)', {
      modes: appearanceMode('Danger'),
    })
    expect(
      resolveMode({ collectionKey: OLD.appearance, modeName: 'Danger' }).target,
    ).toBeNull()
    expect(
      proposal('fill', appearance('Bg/Fill/Emphasis/Default'), danger),
    ).toBe('background/interactive/danger/emphasis/default')
    expect(
      resolve(
        'textFill',
        appearance('Text/Strong on emphasis'),
        text('Label', danger),
      ),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['text/on-emphasis/danger'],
    })
  })

  it('row 46: disabled button', () => {
    const disabled = button('Button / Disabled', { strokeSides: ALL_SIDES })
    expect(proposal('fill', concept('Bg/Disabled'), disabled)).toBe(
      'background/interactive/disabled',
    )
    expect(proposal('stroke', concept('Border/Disabled'), disabled)).toBe(
      'border/interactive/disabled',
    )
    expect(
      proposal('textFill', concept('Text/Disabled'), text('Label', disabled)),
    ).toBe('text/interactive/disabled')
  })

  it('row 47: bottom row gap', () => {
    expect(
      proposal(
        'spacing',
        density('spacing/horizontal/lg'),
        ctx(['Bottom row']),
      ),
    ).toBe('spacing/lg')
  })

  it('row 48: the table density Comfortable becomes compact, not comfortable', () => {
    expect(
      resolveMode({ collectionKey: OLD.density, modeName: 'Comfortable' }),
    ).toMatchObject({
      outcome: 'sure',
      target: { collection: 'density', mode: 'compact' },
    })
  })

  it('row 49: table fill and stroke', () => {
    expect(proposal('fill', surface, table)).toBe('background/surface')
    expect(
      proposal('stroke', staticColour('Border/Neutral/Subtle'), table),
    ).toBe('border/non-interactive/neutral/muted')
  })

  it('row 50: every row: padding, gap and the bottom stroke as a divider', () => {
    for (const name of ['Row / Header', 'Row', 'Row (hover)']) {
      const tableRow = row(name)
      expect(
        proposal('spacing', density('spacing/horizontal/sm'), tableRow),
      ).toBe('spacing/sm')
      expect(
        proposal('spacing', density('spacing/vertical/xs'), tableRow),
      ).toBe('spacing/xs')
      expect(
        resolve('stroke', staticColour('Border/Neutral/Subtle'), tableRow),
      ).toMatchObject({
        outcome: 'sure',
        candidates: ['border/non-interactive/neutral/muted'],
      })
    }
  })

  it('row 51: the hovered row fill', () => {
    expect(
      resolve(
        'fill',
        staticColour('Bg/Neutral/Fill Muted/Hover'),
        row('Row (hover)'),
      ),
    ).toMatchObject({
      outcome: 'sure',
      candidates: ['background/interactive/neutral/muted/hover'],
    })
  })

  it('row 52: header cells set in Inter Medium without a weight variable take label/sm/medium', () => {
    const cell = text('Cell', row('Row / Header'))
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'sm',
            lineHeight: 'squished',
          }),
          'Inter Medium',
          cell,
        ),
      ),
    ).toMatchObject({ outcome: 'sure', candidates: ['label/sm/medium'] })
    expect(
      proposal('textFill', staticColour('Text/Neutral/Subtle'), cell),
    ).toBe('text/secondary')
  })

  it('row 53: body cells', () => {
    const cell = text('Cell', row('Row'))
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'sm',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          cell,
        ),
      ).candidates[0],
    ).toBe('label/sm/default')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Strong'), cell),
    ).toBe('text/primary')
  })

  it('row 54: the overlay mode Dark becomes dark', () => {
    expect(
      resolveMode({ collectionKey: OLD.colorScheme, modeName: 'Dark' }),
    ).toMatchObject({ target: { collection: 'color-scheme', mode: 'dark' } })
  })

  it('row 55: Bg/Backdrop is reported and never bound to background/backdrop', () => {
    const backdrop = resolve('fill', concept('Bg/Backdrop'), overlay)
    expect(backdrop.outcome).toBe('none')
    expect(backdrop.candidates).toEqual([])
  })

  it('row 56: overlay padding', () => {
    expect(proposal('spacing', density('spacing/horizontal/xl'), overlay)).toBe(
      'spacing/xl',
    )
    expect(proposal('spacing', density('spacing/vertical/xl'), overlay)).toBe(
      'spacing/xl',
    )
  })

  it('row 57: menu fill, stroke and padding', () => {
    expect(proposal('fill', concept('Bg/Floating'), menu)).toBe(
      'background/floating',
    )
    expect(
      proposal('stroke', staticColour('Border/Neutral/Subtle'), menu),
    ).toBe('border/non-interactive/neutral/muted')
    expect(proposal('spacing', density('spacing/vertical/xs'), menu)).toBe(
      'spacing/xs',
    )
  })

  it('row 58: menu items', () => {
    const item = menuItem('Menu item')
    expect(proposal('spacing', density('spacing/horizontal/md'), item)).toBe(
      'spacing/md',
    )
    expect(proposal('spacing', density('spacing/vertical/sm'), item)).toBe(
      'spacing/sm',
    )
    const label = text('Label', item)
    expect(
      resolveTypography(
        textInput(
          densityType({
            family: 'ui-body',
            step: 'md',
            lineHeight: 'squished',
          }),
          'Inter Regular',
          label,
        ),
      ).candidates[0],
    ).toBe('label/md/default')
    expect(
      proposal('textFill', staticColour('Text/Neutral/Strong'), label),
    ).toBe('text/primary')
  })

  it('row 59: the selected menu item takes the selected fill, not pressed', () => {
    const selected = menuItem('Menu item (selected)')
    const fill = resolve(
      'fill',
      staticColour('Bg/Accent/Fill Muted/Active'),
      selected,
    )
    expect(fill.outcome).toBe('check')
    expect(fill.candidates[0]).toBe(
      'background/interactive/accent/selected/default',
    )
    const label = text('Label', selected, {
      fillUnder: on(staticColour('Bg/Accent/Fill Muted/Active'), selected),
    })
    expect(
      proposal('textFill', staticColour('Text/Accent/Strong'), label),
    ).toBe('text/on-muted/accent')
  })
})

describe('expected “Needs a decision” list', () => {
  it('lists the backdrop and the shortcut hint, and proposes the icon size', () => {
    const icon = ctx(['Icon / menu', 'Title group', 'Top bar'])
    expect(
      resolve('size', { ...density('sizing/icon/lg'), value: 24 }, icon)
        .outcome,
    ).toBe('check')
    expect(resolve('fill', concept('Bg/Backdrop'), overlay).outcome).toBe(
      'none',
    )
    const hint = resolve(
      'textFill',
      staticColour('Text/Accent/Subtle on emphasis'),
      text('Shortcut hint', button('Button / Primary (hover)')),
    )
    expect(hint.outcome).toBe('check')
  })
})

describe('rules added on 2026-11-11', () => {
  const icon = ctx(['Icon / menu'])

  it('offers the nearest spacing steps when no step has the icon size', () => {
    const result = resolve(
      'size',
      { ...density('sizing/icon/md'), value: 18 },
      icon,
    )
    expect(result.outcome).toBe('check')
    expect(result.candidates.slice(0, 2).sort()).toEqual([
      'spacing/lg',
      'spacing/md',
    ])
  })

  it('matches the icon size in the density the layer will have', () => {
    const compact = ctx(['Icon / menu'], {
      modes: { [OLD.density]: 'Comfortable' },
    })
    expect(
      resolve('size', { ...density('sizing/icon/lg'), value: 20 }, compact),
    ).toMatchObject({ candidates: ['spacing/xl'] })
  })

  it('sets a legacy border width as a number, since there is no stroke width variable', () => {
    const result = resolve(
      'strokeWeight',
      { ...density('sizing/stroke/thin'), value: 1 },
      ctx(['Card']),
    )
    expect(result).toMatchObject({ outcome: 'sure', candidates: ['value:1'] })
  })

  it('reports a border width it cannot read', () => {
    expect(
      resolve('strokeWeight', density('sizing/stroke/thin'), ctx(['Card']))
        .outcome,
    ).toBe('none')
  })
})

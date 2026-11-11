/**
 * Checks the rules against the inventories: every target a rule can propose
 * exists in EDS Foundation [EDS Beta] with a matching type and scope, and
 * background/backdrop is never proposed. The rules run over every published
 * variable in the deprecated libraries, in a set of contexts that covers the
 * roles the rules tell apart.
 */
import { describe, expect, it } from 'vitest'
import {
  getNewTextStyle,
  getNewVariable,
  NEW_TEXT_STYLES,
  NEW_VARIABLES,
  OLD,
} from '../src/mapping/inventory'
import {
  acceptedScopes,
  FORBIDDEN_TARGETS,
  resolveTypography,
  resolveVariable,
  TONES,
} from '../src/mapping/rules'
import type {
  BindingKind,
  OldVariable,
  Resolution,
  RoleContext,
} from '../src/mapping/types'
import {
  ALL_COLOURS,
  APPEARANCE,
  BOX,
  DENSITY,
  DENSITY_STRINGS,
  DYNAMIC_CONCEPT,
  PUBLISHED_COUNTS,
  SPACING_SEMANTIC,
  STATIC_CONCEPT,
  STATIC_SEMANTIC,
} from './fixtures/old-variables'
import { ctx, densityType, staticColour, textInput } from './helpers'

const tinted = (context: RoleContext) => ({
  oldVariable: staticColour('Bg/Info/Fill Muted/Default'),
  context,
})

/** Contexts that cover the roles the rules tell apart. */
const CONTEXTS: Record<string, RoleContext> = {
  layout: ctx(['Panel']),
  card: ctx(['Card'], { strokeSides: [1, 1, 1, 1] }),
  divider: ctx(['Row'], { strokeSides: [0, 0, 1, 0] }),
  button: ctx(['Button / Primary']),
  buttonHover: ctx(['Button (hover)']),
  input: ctx(['Input', 'Text field']),
  selected: ctx(['Menu item (selected)', 'Menu']),
  conflict: ctx(['Chip / Status']),
  reactions: ctx(['Tile'], { hasReactions: true }),
  text: ctx(['Label', 'Card'], { nodeType: 'TEXT', singleLine: true }),
  textOnTint: ctx(['Message', 'Banner'], {
    nodeType: 'TEXT',
    fillUnder: tinted(ctx(['Banner'])),
  }),
  vector: ctx(['Vector', 'Icon'], { nodeType: 'VECTOR' }),
}

const APPEARANCE_MODES = TONES.map((tone) => ({
  [OLD.appearance]: tone[0].toUpperCase() + tone.slice(1),
}))

function kindsFor(variable: OldVariable, context: RoleContext): BindingKind[] {
  if (variable.type === 'COLOR') {
    return context.nodeType === 'TEXT' ? ['textFill'] : ['fill', 'stroke']
  }
  return ['spacing', 'size', 'radius']
}

type Run = {
  variable: OldVariable
  kind: BindingKind
  contextName: string
  context: RoleContext
  resolution: Resolution
}

function runAll(variables: OldVariable[]): Run[] {
  const runs: Run[] = []
  for (const variable of variables) {
    for (const [contextName, base] of Object.entries(CONTEXTS)) {
      const modeSets =
        variable.collectionKey === OLD.appearance ? APPEARANCE_MODES : [{}]
      for (const modes of modeSets) {
        const context = { ...base, modes }
        for (const kind of kindsFor(variable, context)) {
          runs.push({
            variable,
            kind,
            contextName,
            context,
            resolution: resolveVariable({ kind, variable, context }),
          })
        }
      }
    }
  }
  return runs
}

const colourRuns = runAll(ALL_COLOURS)
const numberRuns = runAll([...DENSITY, ...SPACING_SEMANTIC, ...BOX])

describe('old variable list', () => {
  it('rebuilds as many names as the libraries publish', () => {
    expect(STATIC_SEMANTIC).toHaveLength(PUBLISHED_COUNTS.staticSemantic)
    expect(STATIC_CONCEPT).toHaveLength(PUBLISHED_COUNTS.staticConcept)
    expect(DYNAMIC_CONCEPT).toHaveLength(PUBLISHED_COUNTS.dynamicConcept)
    expect(APPEARANCE).toHaveLength(PUBLISHED_COUNTS.appearance)
    expect(DENSITY.length + DENSITY_STRINGS.length).toBe(
      PUBLISHED_COUNTS.density,
    )
    expect(SPACING_SEMANTIC.length + 1).toBe(PUBLISHED_COUNTS.spacingSemantic)
    expect(BOX).toHaveLength(PUBLISHED_COUNTS.box)
  })
})

describe('targets', () => {
  const runs = [...colourRuns, ...numberRuns]

  it('exist in EDS Foundation with the type of the old variable', () => {
    const problems = runs.flatMap((run) =>
      run.resolution.candidates
        .filter((name) => getNewVariable(name)?.type !== run.variable.type)
        .map((name) => `${run.variable.name} → ${name}`),
    )
    expect([...new Set(problems)]).toEqual([])
  })

  it('never name a target that is missing from EDS Foundation', () => {
    const notes = runs
      .filter((run) =>
        run.resolution.reason.includes('is not in EDS Foundation'),
      )
      .map(
        (run) =>
          `${run.variable.name} (${run.kind}, ${run.contextName}): ${run.resolution.reason}`,
      )
    expect([...new Set(notes)]).toEqual([])
  })

  it('never propose background/backdrop', () => {
    for (const run of runs) {
      for (const forbidden of FORBIDDEN_TARGETS) {
        expect(run.resolution.candidates).not.toContain(forbidden)
      }
    }
  })

  it('are only sure when the scope fits the property', () => {
    const problems = runs.flatMap((run) => {
      const proposal = run.resolution.candidates[0]
      if (!proposal || run.resolution.outcome !== 'sure') return []
      const scopes = getNewVariable(proposal)?.scopes ?? []
      const accepted = acceptedScopes(run.kind, run.context.nodeType)
      return scopes.some((scope) => accepted.includes(scope))
        ? []
        : [
            `${run.variable.name} on ${run.kind} (${run.contextName}) → ${proposal} [${scopes.join(', ')}]`,
          ]
    })
    expect([...new Set(problems)]).toEqual([])
  })

  it('give every old colour at least one context with a target, except the backdrop', () => {
    const withTarget = new Set(
      colourRuns
        .filter((run) => run.resolution.candidates.length > 0)
        .map((run) => `${run.variable.collectionKey}/${run.variable.name}`),
    )
    const without = ALL_COLOURS.filter(
      (variable) =>
        !withTarget.has(`${variable.collectionKey}/${variable.name}`),
    ).map((variable) => variable.name)
    expect([...new Set(without)]).toEqual(['Bg/Backdrop'])
  })
})

describe('typography targets', () => {
  it('resolve every old family, step, line height and weight to an existing text style', () => {
    const problems: string[] = []
    const steps = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
    ]
    for (const family of ['header', 'ui-body'] as const) {
      for (const step of steps) {
        for (const lineHeight of ['default', 'squished'] as const) {
          for (const weight of ['normal', 'bolder', 'lighter'] as const) {
            for (const font of [
              family === 'header' ? 'Equinor Medium' : 'Inter Regular',
              'Inter Medium',
              'Inter Bold',
            ]) {
              const resolution = resolveTypography(
                textInput(
                  densityType({ family, step, lineHeight, weight }),
                  font,
                  ctx(['Text', 'Card'], { singleLine: true }),
                ),
              )
              const proposal = resolution.candidates[0]
              if (!proposal || !getNewTextStyle(proposal)) {
                problems.push(
                  `${family}/${step}/${lineHeight}/${weight} ${font}: ${resolution.reason}`,
                )
              }
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })
})

describe('inventory', () => {
  it('has no background/backdrop variable to propose', () => {
    expect(NEW_VARIABLES.map((v) => v.name)).not.toContain(
      'background/backdrop',
    )
  })

  it('has the text styles the rules name', () => {
    const names = NEW_TEXT_STYLES.map((style) => style.name)
    expect(names).toContain('header/4xl')
    expect(names).toContain('label/5xl/bold')
    expect(names).toContain('body/sm/default')
    expect(names).not.toContain('body/md/medium')
  })
})

import { OLD } from '../src/mapping/inventory'
import type {
  OldVariable,
  RoleContext,
  TypographyField,
  TypographyInput,
} from '../src/mapping/types'

export const ROOT = 'Migration test – old EDS variables'

/** A context for a layer in the test frame. `names` is nearest first, without the root frame. */
export function ctx(
  names: string[],
  extra: Partial<RoleContext> = {},
): RoleContext {
  return { nodeType: 'FRAME', names: [...names, ROOT], modes: {}, ...extra }
}

export const staticColour = (name: string): OldVariable => ({
  collectionKey: OLD.staticSemantic,
  name,
  type: 'COLOR',
})

export const concept = (name: string): OldVariable => ({
  collectionKey: OLD.staticConcept,
  name,
  type: 'COLOR',
})

export const appearance = (name: string): OldVariable => ({
  collectionKey: OLD.appearance,
  name,
  type: 'COLOR',
})

export const density = (
  name: string,
  type: OldVariable['type'] = 'FLOAT',
): OldVariable => ({ collectionKey: OLD.density, name, type })

/** A `🗣️ Semantic` variable whose alias chain ends at a `💎 Density` variable. */
export const spacingSemantic = (
  name: string,
  densityName?: string,
  type: OldVariable['type'] = 'FLOAT',
): OldVariable => ({
  collectionKey: OLD.spacingSemantic,
  name,
  type,
  chain: densityName
    ? [{ collectionKey: OLD.density, name: densityName }]
    : undefined,
})

/** The modes that select a tone. */
export const appearanceMode = (tone: string) => ({ [OLD.appearance]: tone })

/**
 * Typography fields bound to `💎 Density` variables, the way most text in the
 * test frame is set: `typography/{family}/{step}/…`.
 */
export function densityType(options: {
  family: 'ui-body' | 'header'
  step: string
  lineHeight?: 'default' | 'squished'
  weight?: 'normal' | 'bolder' | 'lighter'
  tracking?: boolean
}): Partial<Record<TypographyField, OldVariable>> {
  const { family, step, lineHeight, weight, tracking } = options
  const fields: Partial<Record<TypographyField, OldVariable>> = {
    fontSize: density(`typography/${family}/${step}/font-size`),
    fontFamily: density(`typography/${family}/font-family`, 'STRING'),
  }
  if (lineHeight) {
    fields.lineHeight = density(
      `typography/${family}/${step}/line-height-${lineHeight}`,
    )
  }
  if (weight) {
    fields.fontWeight = density(
      `typography/${family}/${step}/font-weight-${weight}`,
    )
  }
  if (tracking) {
    fields.letterSpacing = density(
      `typography/${family}/${step}/tracking-normal`,
    )
  }
  return fields
}

export function textInput(
  fields: TypographyInput['fields'],
  font: string,
  context: RoleContext,
): TypographyInput {
  const [family, ...style] = font.split(' ')
  return {
    fields,
    font: { family, style: style.join(' ') },
    context: { ...context, nodeType: 'TEXT' },
  }
}

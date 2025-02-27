/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  DesignToken,
  Transform,
  TransformedToken,
} from 'style-dictionary/types'

import { resolveReference, transformNumberToRem } from '../utils'
import { StyleDictionary } from 'style-dictionary-utils'
import { usesReferences } from 'style-dictionary/utils'

const {
  hooks: {
    filters: { isNumber },
  },
} = StyleDictionary

export const DENSITY_SPACE_TOGGLE_NAME = 'densitySpaceToggle'

type Params = {
  name: string
  tokens: {
    [tokenName: string]: DesignToken
  }
}

export const createDensitySpaceToggleTransform = (
  params: Params,
): Transform => ({
  name: params.name,
  type: 'value',
  transitive: true,
  filter: isNumber,
  transform: (token: TransformedToken, options) => {
    const path = token.path.join('/')
    const comfortableValue = params.tokens?.[`${path}`]?.['$value']

    if (comfortableValue) {
      //it is a reference
      if (usesReferences(comfortableValue)) {
        //make sure it is not a locally defined variable
        if (token.original.$value != comfortableValue) {
          const outputReferences =
            options?.files?.[0]?.options?.outputReferences
          if (outputReferences) {
            const resolvedComfortableReference = resolveReference(
              `${comfortableValue}`,
              `${options.prefix}`,
            )
            const resolvedSpaciousReference = resolveReference(
              `${token.original.$value}`,
              `${options.prefix}`,
            )
            return `var(--eds--spacious, ${resolvedSpaciousReference}) var(--eds--comfortable, ${resolvedComfortableReference})`
          } else {
            return `var(--eds--spacious, ${token.$value}) var(--eds--comfortable, ${comfortableValue})`
          }
        }
      } else {
        return `var(--eds--spacious, ${
          token.$value
        }) var(--eds--comfortable, ${transformNumberToRem(
          Number(comfortableValue),
        )})`
      }
    }

    return `${token.$value}`
  },
})

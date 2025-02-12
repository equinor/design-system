/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  Transform,
  PlatformConfig,
  TransformedToken,
  DesignToken,
} from 'style-dictionary/types'

import { StyleDictionary } from 'style-dictionary-utils'
import { usesReferences } from 'style-dictionary/utils'

const {
  hooks: {
    filters: { isColor },
  },
} = StyleDictionary

// manually convert reference into custom property
const resolveReference = (value: string, prefix: string): string => {
  if (!value) return ''

  const valueFormatted = value
    .toLowerCase()
    .replace('{', '')
    .replace('}', '')
    .replaceAll(' ', '-')
    .replaceAll('.', '-')

  return `var(--${prefix}-${valueFormatted})`
}

function transformLightDark(
  token: TransformedToken,
  config: PlatformConfig,
  darkValue: string | boolean | number | undefined,
) {
  const outputReferences = config?.files?.[0]?.options?.outputReferences

  //we have to manually create css variables for both light and dark
  let resolvedLightReference
  if (outputReferences && usesReferences(token.original.$value)) {
    resolvedLightReference = resolveReference(
      `${token.original.$value}`,
      `${config.prefix}`,
    )
  }
  if (darkValue) {
    //it is a reference
    if (usesReferences(darkValue)) {
      //make sure it is not a local variable, in which case it has light-dark set already
      if (token.original.$value != darkValue) {
        if (outputReferences) {
          const resolvedDarkReference = resolveReference(
            `${darkValue}`,
            `${config.prefix}`,
          )
          return `light-dark(${resolvedLightReference}, ${resolvedDarkReference})`
        } else {
          return `light-dark(${token.$value}, ${darkValue})`
        }
      }
      //the dark value is not a reference but a direct value (color with alpha transparency)
    } else {
      if (outputReferences && resolvedLightReference) {
        return `light-dark(${resolvedLightReference}, ${darkValue})`
      } else {
        return `light-dark(${token.$value}, ${darkValue})`
      }
    }
  }
  //there is no dark value
  return `${token.$value}`
}

type Params = {
  darkTokensObject: {
    [tokenName: string]: DesignToken
  }
  name: string
}
export const createLightDarkTransform = (params: Params): Transform => ({
  name: params.name,
  type: 'value',
  transitive: true,
  filter: isColor,
  transform: (token: TransformedToken, config: PlatformConfig) => {
    const path = token.path.join('/')
    const darkValue = params.darkTokensObject?.[`${path}`]?.['$value']
    return transformLightDark(token, config, darkValue)
  },
})

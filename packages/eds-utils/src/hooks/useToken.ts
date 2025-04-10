import { useCallback } from 'react'
import type { ComponentToken } from '@equinor/eds-tokens'
import { mergeDeepRight } from 'ramda'
import { DefaultTheme } from 'styled-components'

export type Density = 'compact' | 'comfortable'

type UseToken = (
  options: { density: Density },
  token: ComponentToken,
) => () => DefaultTheme

export const useToken: UseToken = (options, token) =>
  useCallback(() => {
    const { density } = options

    if (density === 'compact') {
      return mergeDeepRight(token, token.modes.compact) as DefaultTheme
    }

    return token as DefaultTheme
  }, [options, token])

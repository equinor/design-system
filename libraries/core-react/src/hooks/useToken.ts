import { useCallback } from 'react'
import type { ComponentToken } from '@equinor/eds-tokens'
import type { Density } from '../components/EdsProvider'
import { mergeDeepRight } from 'ramda'

type UseToken = (
  options: { density: Density },
  token: ComponentToken,
) => () => ComponentToken

export const useToken: UseToken = (options, token) =>
  useCallback(() => {
    const { density } = options

    if (density === 'compact') {
      return mergeDeepRight(token, token.modes.compact)
    }

    return token
  }, [options, token])

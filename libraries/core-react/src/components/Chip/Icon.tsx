import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon as Icon_ } from '../Icon'
import * as tokens from './Chip.tokens'
import { bordersTemplate } from '@utils'

Icon_.add({ close })

const { primary, error } = tokens

type IconProps = {
  variant: 'active' | 'error' | 'default'
  disabled: boolean
}

export const Icon = styled(Icon_)<IconProps>`
  cursor: pointer;
  padding: 1px;
  ${bordersTemplate(primary.entities.icon.border)}

  z-index: 11;

  &:hover {
    ${({ variant }) => {
      switch (variant) {
        case 'error':
          return css`
            background: ${error.entities.icon.background};
            svg {
              fill: ${error.entities.icon.typography.color};
            }
          `
        default:
          return css`
            background: ${primary.entities.icon.states.hover.background};
            svg {
              fill: ${primary.states.hover.typography.color};
            }
          `
      }
    }};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      &:hover {
        background: transparent;
      }
    `}
`

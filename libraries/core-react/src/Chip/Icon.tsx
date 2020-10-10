import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon as Icon_ } from '..'
import { chip as tokens } from './Chip.tokens'

Icon_.add({ close })

const { enabled, hover, error } = tokens

type IconProps = {
  variant: 'active' | 'error' | 'default',
  disabled: boolean
}

export const Icon = styled(Icon_)<IconProps>`
  cursor: pointer;
  padding: 1px;
  border-radius: ${enabled.icon.border.radius};
  z-index: 1000;

  &:hover {
    ${({ variant }) => {
      switch (variant) {
        case 'error':
          return css`
            background: ${error.icon.background};
            svg {
              fill: ${error.icon.color};
            }
          `
        default:
          return css`
            background: ${hover.icon.background};
            svg {
              fill: ${hover.typography.color};
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

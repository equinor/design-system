import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon as Icon_ } from '..'
import { chip as tokens } from './Chip.tokens'

Icon_.add({ close })

const { enabled, hover } = tokens

export const Icon = styled(Icon_)`
  cursor: pointer;
  padding: 2px;
  border-radius: ${enabled.icon.border.radius};
  z-index: 1000;

  &:hover {
    background: ${hover.icon.background};
    svg {
      fill: ${hover.typography.color};
    }
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

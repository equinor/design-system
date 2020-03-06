import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon as Icon_ } from '..'
import { chip as tokens } from './Chip.tokens'

Icon_.add({ close })

const { enabled, hover } = tokens

const disabledOverrides = ({ disabled }) =>
  disabled &&
  css`
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  `

export const Icon = styled(Icon_)`
  cursor: pointer;
  padding: 2px;
  border-radius: ${enabled.icon.border.radius};

  &:hover {
    background: ${hover.icon.background};
    svg {
      fill: ${hover.typography.color};
    }
  }

  ${disabledOverrides}
`

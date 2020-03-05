import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon as Icon_ } from '..'
import { chip as tokens } from './Chip.tokens'

Icon_.add({ close })

const { enabled } = tokens

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
  border-radius: ${enabled.icon.border.radius};

  &:hover {
    background: ${enabled.icon.hover.background};
  }

  ${disabledOverrides}
`

import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { typographyTemplate } = templates

const {
  enabled: { label },
} = tokens

export const MenuLabel = styled.span`
  ${({ disabled }) =>
    disabled
      ? css`
          ${typographyTemplate(label.disabled.typography)}
          svg {
            fill: ${label.disabled.typography.color};
          }
        `
      : css`
          ${typographyTemplate(label.typography)}
          svg {
            fill: ${label.typography.color};
          }
        `}
`

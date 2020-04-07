import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { typographyTemplate } = templates

const {
  enabled: { typography },
} = tokens

export const MenuTitle = styled.span`
  ${({ disabled }) =>
    disabled
      ? css`
          ${typographyTemplate(typography)}
          svg {
            fill: ${typography.color};
          }
        `
      : css`
          ${typographyTemplate(typography)}
          svg {
            fill: ${typography.color};
          }
        `}
`

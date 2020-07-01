import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { typographyTemplate } = templates

const {
  enabled: {
    typography,
    item: {
      disabled: { textColor: disabledColor },
    },
  },
} = tokens

export const MenuTitle = styled.div`
  ${({ disabled }) =>
    disabled
      ? css`
          color: ${disabledColor};
          svg {
            fill: ${disabledColor};
          }
        `
      : css`
          ${typographyTemplate(typography)}
          svg {
            fill: ${typography.color};
          }
        `}
`

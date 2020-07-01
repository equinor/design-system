import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'

const { typographyTemplate } = templates

const {
  enabled: {
    label,
    item: {
      disabled: { textColor: disabledColor },
    },
  },
} = tokens

export const MenuLabel = styled.div`
  ${({ disabled }) =>
    disabled
      ? css`
          color: ${disabledColor};
          svg {
            fill: ${disabledColor};
          }
        `
      : css`
          ${typographyTemplate(label.typography)}
          svg {
            fill: ${label.typography.color};
          }
        `}
`

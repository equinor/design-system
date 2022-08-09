import { forwardRef, ReactNode, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import { Typography } from '../Typography'

type ContainerProps = {
  color?: string
}

const Container = styled.div<ContainerProps>(({ color }) =>
  css({
    display: 'grid',
    gap: '8px',
    gridAutoFlow: 'column',
    alignItems: 'start',
    justifyContent: 'start',
    color,
  }),
)

export type HelperTextProps = {
  /** Helper text */
  text?: string
  /** Icon */
  icon?: ReactNode
  /** Color */
  color?: string
} & HTMLAttributes<HTMLDivElement>

export const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  function TextfieldHelperText(
    {
      text,
      icon,
      color = tokens.colors.text.static_icons__tertiary.rgba,
      ...rest
    },
    ref,
  ) {
    if (!text) {
      return null
    }

    return (
      <Container {...{ ...rest, color, ref }}>
        {icon}
        <Typography group="input" variant="helper" color={color}>
          {text}
        </Typography>
      </Container>
    )
  },
)

import { forwardRef, ReactNode, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { typographyMixin } from '@equinor/eds-utils'
import { helperText as tokens } from './HelperText.token'

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
const Text = styled.p`
  margin: 0;
  ${typographyMixin(tokens.typography)};
`

export type HelperTextProps = {
  /** Helper text */
  text?: string
  /** Icon */
  icon?: ReactNode
  /** Color */
  color?: string
} & HTMLAttributes<HTMLDivElement>

const TextfieldHelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  function TextfieldHelperText(
    { text, icon, color = tokens.typography.color, ...rest },
    ref,
  ) {
    if (!text) {
      return null
    }

    return (
      <Container {...{ ...rest, color, ref }}>
        {icon}
        <Text>{text}</Text>
      </Container>
    )
  },
)

export { TextfieldHelperText as HelperText }

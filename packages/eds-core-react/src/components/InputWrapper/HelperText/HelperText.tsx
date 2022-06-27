import { ReactNode, forwardRef } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@equinor/eds-utils'
import { helperText as tokens } from './HelperText.token'
import { Icon } from '../../Icon'
import type { Spacing } from '@equinor/eds-tokens'

type VariationProps = {
  isFocused?: boolean
  isDisabled?: boolean
}

type StyledProps = {
  spacings?: Spacing
}

const Container = styled.div<StyledProps>`
  display: flex;
  align-items: flex-start;
  margin-top: ${({ spacings }) => spacings.top};
`
const Text = styled.p<StyledProps & VariationProps>`
  ${typographyTemplate(tokens.typography)}
  margin: 0 0 0 ${({ spacings }) => spacings.left};
`

type HelperTextProps = {
  /** Helper text */
  text?: string
  /** Icon */
  icon?: ReactNode
  /** Disabled */
  disabled?: boolean
}

const TextfieldHelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  function TextfieldHelperText({ text, icon, ...rest }, ref) {
    return (
      <Container ref={ref} {...rest}>
        {icon && <Icon size={16}>{icon}</Icon>}
        <Text>{text}</Text>
      </Container>
    )
  },
)

export { TextfieldHelperText as HelperText }

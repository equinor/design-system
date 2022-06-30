import {
  forwardRef,
  ReactNode,
  useMemo,
  cloneElement,
  ReactElement,
} from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '@equinor/eds-utils'
import { helperText as tokens } from './HelperText.token'

type VariationProps = {
  isFocused?: boolean
  isDisabled?: boolean
}

const Container = styled.div`
  display: grid;
  gap: 8px;
  grid-auto-flow: column;
  align-items: start;
  justify-content: start;
  color: ${tokens.typography.color};
`
const Text = styled.p<VariationProps>`
  ${typographyTemplate(tokens.typography)}
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
    if (!text) {
      return null
    }

    return (
      <Container ref={ref} {...rest}>
        {icon}
        <Text>{text}</Text>
      </Container>
    )
  },
)

export { TextfieldHelperText as HelperText }

import React from 'react'
import styled, { css } from 'styled-components'
import { useTextField } from '../context'

type VariationProps = {
  color: string
  focusColor: string
  disabledColor: string
  isDisabled?: boolean
  isFocused?: boolean
}

const Variation = ({
  color,
  focusColor,
  disabledColor,
  isDisabled,
  isFocused,
}: VariationProps) => {
  if (isDisabled) {
    return css`
      fill: ${disabledColor};
    `
  }
  if (isFocused) {
    return css`
      fill: ${focusColor};
    `
  }
  return css`
    fill: ${color};
  `
}

const StyledIcon = styled.div`
  width: 16px;
  height: 16px;
  ${Variation}
`

type TextfieldIconProps = {
  /** Disabled color */
  disabledColor: string
  /** Focus color */
  focusColor: string
  /** Color */
  color: string
  /** isDisabled */
  isDisabled?: boolean
}

const InputIcon = React.forwardRef<HTMLDivElement, TextfieldIconProps>(
  function InputIcon(props, ref) {
    const { children, ...other } = props
    const { isFocused } = useTextField()

    return (
      <StyledIcon ref={ref} isFocused={isFocused} {...other}>
        {children}
      </StyledIcon>
    )
  },
)

// Icon.displayName = 'eds-text-field-icon'

export { InputIcon as Icon }

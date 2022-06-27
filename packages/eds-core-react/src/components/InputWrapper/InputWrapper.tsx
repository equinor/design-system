import { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Label } from '../Label'
import { useEds } from './../EdsProvider'

type InputWrapperType = {
  isFocused?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  variant?: string
  inputIcon?: ReactNode
  unit?: string
  multiline?: boolean
}

export const Box = styled.div<InputWrapperType>``

type UnitType = {
  isDisabled: boolean
}

const Unit = styled.span<UnitType>`
  // TODO Typography
  /*   Yes, we don't like magic numbers, but if you have both unit and icon,
  the unit is slightly off due to line-height and font */
  display: inline-block;
  margin-top: 3px;
`

const Adornments = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  align-self: flex-start;
`

type InputWrapperProps = {
  /** Label */
  label: string
  /** Meta */
  meta: string
  /** Disabled state */
  disabled?: boolean

  /** Read Only */
  readOnly?: boolean
}

export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  function InputWrapper(
    { disabled, readOnly, label, meta, children, ...other },
    ref,
  ) {
    const { density } = useEds()

    return (
      <Box {...other} ref={ref}>
        <Label label={label} meta={meta} />
        {children}
      </Box>
    )
  },
)

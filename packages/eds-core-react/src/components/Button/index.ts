'use client'
import { Button as ButtonWrapper, ButtonProps } from './Button'
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup/ButtonGroup'
import { ToggleButton, ToggleButtonProps } from './ToggleButton/ToggleButton'

type ButtonCompoundProps = typeof ButtonWrapper & {
  Group: typeof ButtonGroup
  Toggle: typeof ToggleButton
}

const Button = ButtonWrapper as ButtonCompoundProps
Button.Group = ButtonGroup
Button.Toggle = ToggleButton

Button.Group.displayName = 'Button.Group'
Button.Toggle.displayName = 'Button.Toggle'

export { Button }
export type { ButtonProps, ButtonGroupProps, ToggleButtonProps }

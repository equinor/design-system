import { Button as ButtonWrapper, ButtonProps } from './Button'
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup/ButtonGroup'

type ButtonCompoundProps = typeof ButtonWrapper & {
  Group: typeof ButtonGroup
}

const Button = ButtonWrapper as ButtonCompoundProps
Button.Group = ButtonGroup

Button.Group.displayName = 'Button.Group'

export { Button }
export type { ButtonProps, ButtonGroupProps }

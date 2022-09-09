import {
  HTMLAttributes,
  cloneElement,
  Children as RecatChildren,
  forwardRef,
  ReactElement,
  useState,
} from 'react'
import { Variants } from './ToggleButton.types'
import { Button } from '..'

export type ToggleButtonProps = {
  /** Current selected value. */
  value: string[] | string
  /** Determine selection option */
  variant?: Variants
  /** Callback fired when the state changes. */
  onChange?: (event: React.MouseEvent, newValue: string[] | string) => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>

export const ToggleButton = forwardRef<HTMLDivElement, ToggleButtonProps>(
  function ToggleButton({ children, value, onChange, ...props }, ref) {
    const [selectedButton, setSelectedButton] = useState<number[] | number>(
      Array(RecatChildren.toArray(children).length),
    )

    const updatedChildren = RecatChildren.map(children, (child, index) => {
      return cloneElement(child as ReactElement, {
        'aria-pressed': true,
        value,
        index,
        onChange,
      })
    })
    return (
      <Button.Group ref={ref} {...props}>
        {updatedChildren}
      </Button.Group>
    )
  },
)

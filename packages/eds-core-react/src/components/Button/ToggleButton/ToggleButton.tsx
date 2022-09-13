import {
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
  forwardRef,
  ReactElement,
  useState,
} from 'react'
import { Button, ButtonProps, ButtonGroupProps } from '..'

export type ToggleButtonProps = {
  /** Multiple */
  multiple?: boolean
} & HTMLAttributes<HTMLDivElement> &
  Pick<ButtonGroupProps, 'vertical'>

export const ToggleButton = forwardRef<HTMLDivElement, ToggleButtonProps>(
  function ToggleButton({ children, multiple, ...props }, ref) {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])

    const updatedChildren = ReactChildren.map(
      children,
      (child, index: number) => {
        const isSelected = selectedIndexes.includes(index)

        const buttonProps: ButtonProps = {
          'aria-pressed': isSelected ? true : undefined,
          variant: isSelected ? 'contained' : 'outlined',
          onClick: () => {
            if (multiple) {
              setSelectedIndexes((prevSelectedIndexes) =>
                prevSelectedIndexes.includes(index)
                  ? prevSelectedIndexes.filter((i) => i !== index)
                  : [...prevSelectedIndexes, index],
              )
            } else {
              setSelectedIndexes([index])
            }
          },
        }
        return cloneElement(child as ReactElement, buttonProps)
      },
    )

    return (
      <Button.Group ref={ref} {...props}>
        {updatedChildren}
      </Button.Group>
    )
  },
)

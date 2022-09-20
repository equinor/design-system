import {
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
  forwardRef,
  ReactElement,
  useState,
  useEffect,
} from 'react'
import { Button, ButtonProps, ButtonGroupProps } from '..'

export type ToggleButtonProps = {
  /** Multiple */
  multiple?: boolean
  /** Array of selected indexses. */
  selected?: number[]
  /** OnChange */
  onChange?: (indexes: number[]) => void
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'> &
  Pick<ButtonGroupProps, 'vertical'>

export const ToggleButton = forwardRef<HTMLDivElement, ToggleButtonProps>(
  function ToggleButton(
    { children, multiple, selected, onChange, ...props },
    ref,
  ) {
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>(
      selected || [],
    )

    useEffect(() => {
      if (Array.isArray(selected)) {
        setSelectedIndexes(selected)
      }
    }, [selected])

    const updatedChildren = ReactChildren.map(
      children,
      (child, index: number) => {
        const isSelected = selectedIndexes.includes(index)

        const buttonProps: ButtonProps = {
          'aria-pressed': isSelected ? true : undefined,
          variant: isSelected ? 'contained' : 'outlined',
          onClick: () => {
            let updatedSelection = [index]

            if (multiple) {
              updatedSelection = selectedIndexes.includes(index)
                ? selectedIndexes.filter((i) => i !== index)
                : [...selectedIndexes, index]
            }
            setSelectedIndexes(updatedSelection)
            if (onChange) {
              onChange(updatedSelection)
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

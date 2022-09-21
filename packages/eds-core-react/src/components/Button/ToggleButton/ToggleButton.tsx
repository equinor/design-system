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
  selectedIndexes?: number[]
  /** OnChange */
  onChange?: (indexes: number[]) => void
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'> &
  Pick<ButtonGroupProps, 'vertical'>

export const ToggleButton = forwardRef<HTMLDivElement, ToggleButtonProps>(
  function ToggleButton(
    { children, multiple, selectedIndexes, onChange, ...props },
    ref,
  ) {
    const [pickedIndexes, setPickedIndexes] = useState<number[]>(
      selectedIndexes || [],
    )

    useEffect(() => {
      if (Array.isArray(selectedIndexes)) {
        setPickedIndexes(selectedIndexes)
      }
    }, [selectedIndexes])

    const updatedChildren = ReactChildren.map(
      children,
      (child, index: number) => {
        const isSelected = pickedIndexes.includes(index)

        const buttonProps: ButtonProps = {
          'aria-pressed': isSelected ? true : undefined,
          variant: isSelected ? 'contained' : 'outlined',
          onClick: () => {
            let updatedSelection = [index]

            if (multiple) {
              updatedSelection = pickedIndexes.includes(index)
                ? pickedIndexes.filter((i) => i !== index)
                : [...pickedIndexes, index]
            }
            setPickedIndexes(updatedSelection)
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

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
  /** Array of selected buttons */
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
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>(selected)
    const isInitialSelected = Array.isArray(selected)

    useEffect(() => {
      if (isInitialSelected) {
        setSelectedIndexes(selected)
      }
    }, [selected, isInitialSelected])

    const updatedChildren = ReactChildren.map(
      children,
      (child, index: number) => {
        const isSelected = selectedIndexes.includes(index)

        const buttonProps: ButtonProps = {
          'aria-pressed': isSelected ? true : undefined,
          variant: isSelected ? 'contained' : 'outlined',
          onClick: () => {
            if (multiple) {
              setSelectedIndexes((prevSelectedIndexes) => {
                const updatedSelection = prevSelectedIndexes.includes(index)
                  ? prevSelectedIndexes.filter((i) => i !== index)
                  : [...prevSelectedIndexes, index]

                return updatedSelection
              })
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

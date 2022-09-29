import {
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
  forwardRef,
  ReactElement,
  useState,
  useEffect,
  isValidElement,
  AllHTMLAttributes,
} from 'react'
import { Button, ButtonProps } from '../Button'
import { ButtonGroupProps, ButtonGroup } from '../ButtonGroup'

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
        const childElement = child as ReactElement<
          AllHTMLAttributes<HTMLElement>
        >

        if (isValidElement(child) && child.type === Button) {
          const buttonProps: ButtonProps = {
            'aria-pressed': isSelected ? true : undefined,
            variant: isSelected ? 'contained' : 'outlined',
            onClick: (e) => {
              childElement.props?.onClick?.(e)
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
        }
      },
    )

    return (
      <ButtonGroup ref={ref} {...props}>
        {updatedChildren}
      </ButtonGroup>
    )
  },
)

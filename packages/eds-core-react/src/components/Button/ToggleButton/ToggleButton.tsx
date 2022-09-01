import {
  ButtonHTMLAttributes,
  cloneElement,
  Children as RecatChildren,
  forwardRef,
  ReactElement,
  useState,
} from 'react'
import { Button } from '..'

export type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton({ children, ...rest }, ref) {
    // const countArray = RecatChildren.toArray(children).length
    const [selectedButton, setSelectedButton] = useState<number[]>()
    //   Array(countArray),

    const updatedChildren = RecatChildren.map(children, (child, index) =>
      cloneElement(child as ReactElement, {
        'aria-pressed': true,
        // onClick: () => {
        //   setSelectedButton((prevState) => {
        //     console.log(index)
        //     return
        //   })
        // },
      }),
    )

    return <Button.Group>{updatedChildren}</Button.Group>
  },
)

import { Icon } from '../../Icon'
import { close, IconData } from '@equinor/eds-icons'
import { KeyboardEvent } from 'react'
import { Button } from '../../Button/Button'
import styled from 'styled-components'
import { AriaButtonProps } from 'react-aria'
import { filterDOMProps } from '@react-aria/utils'

const StyledButton = styled(Button)`
  height: 24px;
  width: 24px;
`

/**
 * Toggle component encapsulates the reset and open calendar buttons
 */
export const Toggle = ({
  reset,
  setOpen,
  open,
  icon,
  disabled,
  buttonProps,
  valueString,
  readonly,
}: {
  reset: () => void
  setOpen: (open: boolean) => void
  open: boolean
  icon: IconData
  disabled: boolean
  readonly: boolean
  buttonProps: AriaButtonProps
  valueString: string
}) => {
  return readonly || disabled ? null : (
    <>
      <StyledButton
        disabled={disabled}
        variant={'ghost_icon'}
        aria-label={'Reset'}
        onClick={() => {
          reset()
        }}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault()
            e.stopPropagation()
            reset()
          }
        }}
      >
        <Icon data={close} />
      </StyledButton>
      <StyledButton
        {...filterDOMProps(buttonProps)}
        disabled={disabled}
        aria-label={valueString ? `Change date, ${valueString}` : `Change date`}
        variant={'ghost_icon'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!open)
        }}
      >
        <Icon data={icon} />
      </StyledButton>
    </>
  )
}

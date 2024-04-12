import { Icon } from '../../Icon'
import { close, IconData } from '@equinor/eds-icons'
import { KeyboardEvent } from 'react'
import { Button } from '../../Button/Button'
import styled, { css } from 'styled-components'
import { AriaButtonProps } from 'react-aria'

const StyledButton = styled(Button)(
  () => css`
    height: 24px;
    width: 24px;
  `,
)

/**
 * Toggle component encapsulates the reset and open calendar buttons
 * @param reset
 * @param setOpen
 * @param open
 * @param icon
 * @param disabled
 * @param buttonProps */
export const Toggle = ({
  reset,
  setOpen,
  open,
  icon,
  disabled,
  buttonProps,
}: {
  reset: () => void
  setOpen: (open: boolean) => void
  open: boolean
  icon: IconData
  disabled: boolean
  buttonProps: AriaButtonProps
}) => {
  return (
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
        {...buttonProps}
        disabled={disabled}
        aria-label={'Toggle calendar'}
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

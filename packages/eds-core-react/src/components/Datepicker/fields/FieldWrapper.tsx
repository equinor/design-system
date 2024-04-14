import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
} from 'react'
import {
  InputWrapper,
  InputWrapperProps,
  Popover,
  useEds,
} from '../../../index'
import { GroupDOMAttributes } from '@react-types/shared'
import { filterDOMProps } from '@react-aria/utils'

const getVariant = (variant: InputWrapperProps['color']) => {
  if (variant === 'error') {
    return tokens.colors.interactive.danger__resting.rgba
  }
  if (variant === 'success') {
    return tokens.colors.interactive.success__resting.rgba
  }
  if (variant === 'warning') {
    return tokens.colors.interactive.warning__resting.rgba
  }
  return tokens.colors.interactive.primary__resting.rgba
}

const getVariantText = (variant: InputWrapperProps['color']) => {
  if (variant === 'error') {
    return tokens.colors.interactive.danger__text.rgba
  }
  if (variant === 'success') {
    return tokens.colors.interactive.success__text.rgba
  }
  if (variant === 'warning') {
    return tokens.colors.interactive.warning__text.rgba
  }
  return tokens.colors.text.static_icons__default.rgba
}

const StyledInputFieldWrapper = styled.div<{
  $density: 'compact' | 'comfortable'
  $variant?: InputWrapperProps['color']
  $disabled: boolean
}>`
  display: flex;
  align-items: center;
  background-color: ${tokens.colors.ui.background__light.rgba};
  height: ${({ $density }) => ($density === 'compact' ? '24px' : '36px')};
  padding: 0 8px;
  ${({ $variant, $disabled }) => {
    if (!$variant) {
      return `&:focus-within:not(.invalid) {
    outline: 2px solid
      ${tokens.colors.interactive.primary__resting.rgba};
  }
  
  ${
    !$disabled &&
    `&:not(:focus-within) {
    box-shadow: inset 0 -1px 0 0 ${tokens.colors.text.static_icons__tertiary.rgba};`
  }
  }
  `
    }
    return `outline: 2px solid ${getVariant($variant)};`
  }}
  color: ${(p) => getVariantText(p.$variant)};
  cursor: default;
`

type WrapperProps = {
  children: ReactNode
  color?: InputWrapperProps['color']
  disabled: boolean
} & HTMLAttributes<HTMLDivElement>

/**
 * Applies styles around the date input fields (density, color etc.)
 */
export const InputFieldWrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ children, color, disabled, ...props }, ref) => {
    const { density } = useEds()
    return (
      <StyledInputFieldWrapper
        ref={ref}
        $density={density}
        $variant={color}
        $disabled={disabled ?? false}
        {...filterDOMProps(props)}
      >
        {children}
      </StyledInputFieldWrapper>
    )
  },
)

type Props = {
  children: ReactNode
  open: boolean | null
  setOpen: (open: boolean) => void
  label?: string
  calendar: ReactNode
  pickerRef: RefObject<HTMLDivElement>
  extraProps?: GroupDOMAttributes
} & InputWrapperProps

export const FieldWrapper = forwardRef(
  (
    { children, pickerRef, calendar, open, setOpen, label, ...props }: Props,
    ref,
  ) => {
    useEffect(() => {
      if (open) {
        const selected: HTMLDivElement =
          pickerRef.current?.querySelector(`.cell.selected`)
        const first: HTMLDivElement = pickerRef.current?.querySelector(
          '.cell:not(.disabled)',
        )
        if (selected) selected.focus()
        else first?.focus()
      } else if (open === false) {
        const segment: HTMLDivElement = (
          ref as RefObject<HTMLDivElement>
        ).current?.querySelector('.segment')
        segment?.focus()
      }
    }, [ref, open, pickerRef])

    return (
      <>
        <InputWrapper
          label={label}
          onKeyDownCapture={(event: KeyboardEvent<HTMLDivElement>) => {
            const isIconTarget = event.target instanceof SVGSVGElement
            if (
              !isIconTarget &&
              (event.code === 'Space' || event.code === 'Enter')
            ) {
              setOpen(true)
            }
          }}
          {...props}
        >
          {children}
        </InputWrapper>

        <Popover
          open={open ?? false}
          onClose={() => setOpen(false)}
          anchorEl={(ref as RefObject<HTMLElement>).current}
          placement={'bottom-start'}
        >
          <Popover.Content>{calendar}</Popover.Content>
        </Popover>
      </>
    )
  },
)

InputFieldWrapper.displayName = 'InputFieldWrapper'
FieldWrapper.displayName = 'FieldWrapper'